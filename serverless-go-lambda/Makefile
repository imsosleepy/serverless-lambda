.PHONY: build-lambda
build-lambda: clean
	CGO_ENABLED=0 GOOS=linux GOARCH=arm64 go build -tags lambda.norpc -ldflags '-s -w' -trimpath \
		-o bootstrap lambda/main.go

.PHONY: clean
clean:
	go clean
	rm -f bootstrap

.PHONY: deploy-function
deploy-function: build-lambda
	sls deploy function -f go_function

.PHONY: deploy
deploy: build-lambda
	sls deploy --verbose

