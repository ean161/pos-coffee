-- ============================================================
--  Dọn duplicate shift_slots theo (name, work_date)
--  Giữ lại 1 bản ghi (id nhỏ nhất) cho mỗi cặp (name, work_date)
--  Xóa các assignment tham chiếu slot trùng trước (nếu có).
--  Sau đó áp dụng unique constraint để ngăn tạo trùng về sau.
-- ============================================================

BEGIN TRANSACTION;

-- 1. Xem trước các slot trùng
SELECT name, work_date, COUNT(*) AS dup_count
FROM shift_slots
GROUP BY name, work_date
HAVING COUNT(*) > 1
ORDER BY work_date DESC, name;

-- 2. Xóa assignment của slot trùng (giữ slot có id nhỏ nhất)
DELETE a
FROM shift_assignments a
INNER JOIN shift_slots s ON a.slot_id = s.id
INNER JOIN (
    SELECT name, work_date, MIN(id) AS keep_id
    FROM shift_slots
    GROUP BY name, work_date
) k ON s.name = k.name AND s.work_date = k.work_date
WHERE s.id <> k.keep_id;

-- 3. Xóa slot trùng (giữ id nhỏ nhất)
DELETE s
FROM shift_slots s
INNER JOIN (
    SELECT name, work_date, MIN(id) AS keep_id
    FROM shift_slots
    GROUP BY name, work_date
) k ON s.name = k.name AND s.work_date = k.work_date
WHERE s.id <> k.keep_id;

-- 4. Thêm unique constraint (nếu chưa có)
IF NOT EXISTS (
    SELECT 1 FROM sys.indexes
    WHERE name = 'uk_shift_slot_name_workdate'
      AND object_id = OBJECT_ID('shift_slots')
)
BEGIN
    ALTER TABLE shift_slots
    ADD CONSTRAINT uk_shift_slot_name_workdate UNIQUE (name, work_date);
END;

-- 5. Xác nhận
SELECT name, work_date, COUNT(*) AS cnt
FROM shift_slots
GROUP BY name, work_date
HAVING COUNT(*) > 1;

COMMIT;