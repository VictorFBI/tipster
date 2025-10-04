BINDIR=${CURDIR}/bin

install-deps:
	GOBIN=${BINDIR} go install github.com/oapi-codegen/oapi-codegen/v2/cmd/oapi-codegen@latest

api-generate:
	rm -rf ${CURDIR}/internal/api/*
	${BINDIR}/oapi-codegen --config=${CURDIR}/configs/oapi-codegen.yaml -o ${CURDIR}/internal/api/api.gen.go ${CURDIR}/api/api.yaml
	${BINDIR}/oapi-codegen --config=${CURDIR}/configs/oapi-codegen.yaml -o ${CURDIR}/internal/api/auth.gen.go ${CURDIR}/api/auth.yaml
