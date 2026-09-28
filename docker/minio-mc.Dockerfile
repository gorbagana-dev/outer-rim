# Community mc client. Build context is a checkout of
# github.com/minio/mc at RELEASE.2025-08-13T08-35-41Z.
# Image must include /bin/sh: minio-provision overrides the entrypoint.
FROM golang:1.24-bookworm AS build
WORKDIR /src
COPY . .
RUN CGO_ENABLED=0 go build -trimpath -o /out/mc .

FROM debian:bookworm-slim
RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates \
    && rm -rf /var/lib/apt/lists/*
COPY --from=build /out/mc /usr/bin/mc
ENTRYPOINT ["mc"]
