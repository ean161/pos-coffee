-- ============================================================
--  Xóa sạch dữ liệu shift để test lại từ đầu
--  Xóa theo thứ tự: assignments trước (vì FK), slots sau.
--  KHÔNG xóa bảng employees/users.
-- ============================================================

BEGIN TRANSACTION;

-- 1. (Tuỳ chọn) xem trước số lượng
SELECT 'shift_assignments' AS table_name, COUNT(*) AS cnt FROM shift_assignments
UNION ALL
SELECT 'shift_slots', COUNT(*) FROM shift_slots;

-- 2. Xóa tất cả assignments
DELETE FROM shift_assignments;
DBCC CHECKIDENT ('shift_assignments', RESEED, 0);

-- 3. Xóa tất cả slots
DELETE FROM shift_slots;
DBCC CHECKIDENT ('shift_slots', RESEED, 0);

-- 4. Xác nhận đã sạch
SELECT 'shift_assignments' AS table_name, COUNT(*) AS cnt FROM shift_assignments
UNION ALL
SELECT 'shift_slots', COUNT(*) FROM shift_slots;

COMMIT;