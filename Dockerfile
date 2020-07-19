FROM golang:1.13.4-alpine as build-env
WORKDIR /esy
COPY . .
RUN apk add git
RUN go get "github.com/gin-gonic/gin" 
RUN go build -o esy

FROM alpine:latest
WORKDIR /esy
COPY --from=build-env /esy/ .

CMD ["./esy"]
