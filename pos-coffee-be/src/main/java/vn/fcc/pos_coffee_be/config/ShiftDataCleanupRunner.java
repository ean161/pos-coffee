package vn.fcc.pos_coffee_be.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

/**
 * Tự động dọn duplicate rows trong shift_slots / shift_assignments / shifts
 * mỗi khi BE start. Chạy SAU ShiftSlotSeeder để nó có cơ hội seed trước.
 *
 * Lưu ý: với MySQL (hoặc H2), subquery trong DELETE cần được wrap trong một
 * derived table. SQL Server chấp nhận cả hai dạng.
 */
@Component
@Order(20)
@RequiredArgsConstructor
@Slf4j
public class ShiftDataCleanupRunner implements CommandLineRunner {

    private final JdbcTemplate jdbc;

    @Override
    public void run(String... args) {
        try {
            // 1. Dọn duplicate shift_assignments (giữ id nhỏ nhất theo user+date)
            int da = jdbc.update(
                    "DELETE FROM shift_assignments WHERE id NOT IN (" +
                            "SELECT MIN_ID FROM (" +
                            "  SELECT MIN(id) AS MIN_ID FROM shift_assignments " +
                            "  GROUP BY employee_user_id, work_date" +
                            ") k)"
            );

            // 2. Dọn duplicate shift_slots theo (name, work_date),
            //    giữ id nhỏ nhất. Phải chạy sau assignments vì có FK slot_id.
            int ds = jdbc.update(
                    "DELETE FROM shift_slots WHERE id NOT IN (" +
                            "SELECT KEEP_ID FROM (" +
                            "  SELECT MIN(id) AS KEEP_ID FROM shift_slots " +
                            "  GROUP BY name, work_date" +
                            ") k)"
            );

            // 3. Dọn duplicate shifts giữ row CHECKED_IN (nếu có)
            int ds2 = jdbc.update(
                    "DELETE FROM shifts WHERE id NOT IN (" +
                            "SELECT id FROM (" +
                            "  SELECT id, ROW_NUMBER() OVER (" +
                            "    PARTITION BY user_id, CAST(open_time AS DATE) " +
                            "    ORDER BY CASE WHEN status = 'CHECKED_IN' THEN 0 ELSE 1 END, open_time ASC" +
                            "  ) rn FROM shifts" +
                            ") t WHERE rn = 1)"
            );

            if (da + ds + ds2 > 0) {
                log.info("ShiftDataCleanupRunner: removed {} duplicate assignments, "
                        + "{} duplicate shift slots, {} duplicate shifts", da, ds, ds2);
            } else {
                log.info("ShiftDataCleanupRunner: DB clean, nothing to remove");
            }
        } catch (Exception e) {
            // Không để startup fail vì cleanup; chỉ log cảnh báo.
            log.warn("ShiftDataCleanupRunner failed (non-fatal): {}", e.getMessage());
        }
    }
}
