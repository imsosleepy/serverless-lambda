package main

import (
	"bufio"
	"bytes"
	"context"
	"encoding/json"
	"os"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/rs/zerolog/log"
)

// Response is of type APIGatewayProxyResponse since we're leveraging the
// AWS Lambda Proxy Request functionality (default behavior)
//
// https://serverless.com/framework/docs/providers/aws/events/apigateway/#lambda-proxy-integration
type Response events.APIGatewayProxyResponse

// Handler is our lambda handler invoked by the `lambda.Start` function call
func Handler(ctx context.Context) (Response, error) {
	// bytes.Buffer를 사용하여 메모리 내에서 파일 내용을 관리
	text := "Hello, World!\n"
	var buffer bytes.Buffer
	buffer.WriteString(text)

	fileName := "/tmp/example.txt"
	// 파일 생성
	file, err := os.Create(fileName)
	if err != nil {
		panic(err)
	}

	// 버퍼된 라이터 생성
	writer := bufio.NewWriter(file)

	// 파일에 텍스트 쓰기
	_, err = writer.WriteString(text)
	if err != nil {
		panic(err)
	}

	// 버퍼의 내용을 파일로 플러시
	err = writer.Flush()
	if err != nil {
		panic(err)
	}

	defer file.Close()

	// S3 Upload
	cfg, err := config.LoadDefaultConfig(context.TODO())
	if err != nil {
		log.Err(err).Msg("Configuration error")
		return Response{StatusCode: 500}, err
	}

	client := s3.NewFromConfig(cfg)

	_, err = client.PutObject(context.TODO(), &s3.PutObjectInput{
		Bucket:      aws.String("testbed-lambda-bucket"),
		Key:         aws.String(fileName),
		Body:        &buffer,
		ContentType: aws.String("text/plain"),
	})

	if err != nil {
		log.Err(err).Caller().Msg("Upload to S3 error")
		return Response{StatusCode: 500}, err
	}

	// 파일 삭제
	err = os.Remove(fileName)
	if err != nil {
		panic(err)
	}

	responseBody, err := json.Marshal(map[string]interface{}{
		"message": "File uploaded successfully",
	})

	if err != nil {
		return Response{StatusCode: 500}, err
	}

	return Response{
		StatusCode:      200,
		IsBase64Encoded: false,
		Body:            string(responseBody),
		Headers: map[string]string{
			"Content-Type": "application/json",
		},
	}, nil

}

func main() {
	lambda.Start(Handler)
}
