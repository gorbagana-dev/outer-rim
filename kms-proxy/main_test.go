package main

import (
	"encoding/base64"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

func signRequest(messageType, algorithm string, message []byte) []byte {
	body, err := json.Marshal(kmsRequest{
		Message:          base64.StdEncoding.EncodeToString(message),
		MessageType:      messageType,
		SigningAlgorithm: algorithm,
	})
	if err != nil {
		panic(err)
	}
	return body
}

func TestHandleSignRejectsUnsupportedAlgorithm(t *testing.T) {
	recorder := httptest.NewRecorder()

	handleSign(recorder, signRequest("DIGEST", "RSASSA_PSS_SHA_256", make([]byte, 32)))

	if recorder.Code != http.StatusBadRequest {
		t.Fatalf("status = %d, want %d", recorder.Code, http.StatusBadRequest)
	}
	if !strings.Contains(recorder.Body.String(), "SigningAlgorithm must be ECDSA_SHA_256") {
		t.Fatalf("unexpected response: %s", recorder.Body.String())
	}
}

func TestHandleSignRejectsInvalidDigestLength(t *testing.T) {
	recorder := httptest.NewRecorder()

	handleSign(recorder, signRequest("DIGEST", "ECDSA_SHA_256", make([]byte, 31)))

	if recorder.Code != http.StatusBadRequest {
		t.Fatalf("status = %d, want %d", recorder.Code, http.StatusBadRequest)
	}
	if !strings.Contains(recorder.Body.String(), "DIGEST message must be 32 bytes") {
		t.Fatalf("unexpected response: %s", recorder.Body.String())
	}
}

func TestHealth(t *testing.T) {
	request := httptest.NewRequest(http.MethodGet, "/health", nil)
	recorder := httptest.NewRecorder()

	handler(recorder, request)

	if recorder.Code != http.StatusOK {
		t.Fatalf("status = %d, want %d", recorder.Code, http.StatusOK)
	}
	if recorder.Body.String() != "ok" {
		t.Fatalf("body = %q, want %q", recorder.Body.String(), "ok")
	}
}
