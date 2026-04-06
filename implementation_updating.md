# Progress Report - Week 1 Contract Lock (Dang)

Date: 2026-04-06
Owner: Dang
Scope: Chot contract orchestration + API boundary + quota convention 413/429

## 1) Dau viec da trien khai

### 1.1 Orchestration contract da duoc khoa
- Da tao contract version week1-v1.
- Da dinh nghia node khung co dinh:
	- intake_context
	- gateway_router
	- finalize_output
- Da chot schema Input/Output cho tung node (trace_id, run_id, tier, node, payload, status, timestamps, error).
- Da them error envelope dung chung de API va orchestration thong nhat cau truc loi.

File chinh:
- workflow_graph.py

### 1.2 Da dat ham rong va TODO de co dinh khung luong
- Da dat skeleton node:
	- _node_intake_context(...)
	- _node_gateway_router(...)
	- _node_finalize_output(...)
- Da gan TODO ro rang cho Week 2:
	- thay parser/tier context that
	- thay LLM gateway/router that
	- noi quality gate hooks + trace artifacts

File chinh:
- workflow_graph.py

### 1.3 API boundary va skeleton route da duoc khoa
- Da them endpoint cong bo contract:
	- GET /api/v1/planning/contracts/week1
- Da them endpoint chay mock end-to-end:
	- POST /api/v1/planning/orchestration/mock-run
- Da khoa trace propagation qua header X-Trace-Id (nhan vao hoac tu sinh, tra ra response header).

File chinh:
- main.py
- schemas.py (OrchestrationMockRequest)

### 1.4 Quy uoc loi quota 413/429 da thong nhat
- Da enforce v1 theo tier Free/Plus/Pro cho:
	- file/request
	- file/day
	- file_size_mb
	- url/day
- Da thong nhat ma loi:
	- 413:
		- QUOTA_FILE_SIZE_EXCEEDED
		- QUOTA_FILES_PER_REQUEST_EXCEEDED
	- 429:
		- QUOTA_FILES_PER_DAY_EXCEEDED
		- QUOTA_URLS_PER_DAY_EXCEEDED
- Da su dung error envelope thong nhat cho cac loi quota.

File chinh:
- main.py
- workflow_graph.py (build_error_envelope)

## 2) Ban giao Week 1

### 2.1 Khung orchestration + API compile/run duoc cho luong mock
- Da compile thanh cong cac file chinh:
	- workflow_graph.py
	- main.py
	- schemas.py
- Da smoke test duong di toi thieu end-to-end:
	- goi run_week1_orchestration_contract(...) -> success
	- co trace_id
	- co du 3 node_outputs
- Da smoke test API route mock-run:
	- HTTP 200
	- status success
	- trace_id trong body trung X-Trace-Id trong response header

Luu y moi truong test:
- Import app day du dang phu thuoc mot so package ngoai (pdfplumber, langchain_google_genai).
- Da dung runtime stubs de test rieng boundary route moi, khong anh huong contract da trien khai.

### 2.2 Da cap nhat dac ta implementation
- Da cap nhat chi tiet Week 1 trong file:
	- document/implementation.md

Noi dung da them gom:
- Contract orchestration
- API boundaries
- Error convention 413/429
- Dieu kien ban giao
- Gate checklist PASS/FAIL

### 2.3 Checklist Gate Thu 6 da ro PASS/FAIL
- Da co checklist 8 muc PASS/FAIL trong document/implementation.md.
- Bao gom ca quality contract response va 4 case quota bat buoc.

## 3) Ket qua doi chieu tieu chi hoan thanh

Yeu cau 1: Co 1 duong di end-to-end toi thieu chay duoc
- Trang thai: DAT
- Bang chung: mock-run route tra success, co trace id, co du node outputs.

Yeu cau 2: Khong con mo ho ve contract giua orchestration va API
- Trang thai: DAT
- Bang chung:
	- Contract version week1-v1 da khoa.
	- Input/Output node da co schema thong nhat.
	- Endpoint contract cong bo cong khai de cac nhom bam theo.

Ket luan tong:
- Ban trien khai hien tai DA DU scope Week 1 theo dung dau viec va tieu chi ban dua ra.

## 4) Risk nho con lai (khong chan Gate Week 1)
- Quota counter hien tai dung in-memory, chua qua DB boundary (du kien Week 2).
- Can bo sung test tu dong chinh thuc cho endpoint moi trong tests/ de gate CI vung hon.
- Can chay lai smoke test full app khong stubs sau khi cai du dependency moi truong.
