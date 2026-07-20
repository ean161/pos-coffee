package vn.fcc.pos_coffee_be.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/maintenance")
@RequiredArgsConstructor
public class MaintenanceController {

    private final JdbcTemplate jdbcTemplate;

    @PostMapping("/cleanup-shift-duplicates")
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public Map<String, Object> cleanupShiftDuplicates() {
        // 1. Xóa duplicate shift_assignments (giữ id nhỏ nhất cho mỗi user+date)
        int deletedAssignments = jdbcTemplate.update(
                "DELETE FROM shift_assignments WHERE id NOT IN (" +
                        "SELECT MIN_ID FROM (" +
                        "  SELECT MIN(id) AS MIN_ID FROM shift_assignments " +
                        "  GROUP BY employee_user_id, work_date" +
                        ") k)"
        );

        // 2. Xóa duplicate shift_slots theo (name, work_date), giữ id nhỏ nhất.
        //    Phải chạy sau khi assignments đã sạch, vì shift_assignments có FK slot_id.
        int deletedSlots = jdbcTemplate.update(
                "DELETE FROM shift_slots WHERE id NOT IN (" +
                        "SELECT KEEP_ID FROM (" +
                        "  SELECT MIN(id) AS KEEP_ID FROM shift_slots " +
                        "  GROUP BY name, work_date" +
                        ") k)"
        );

        // 3. Dọn duplicate shifts (nếu có sẵn từ logic cũ)
        int deletedShifts = jdbcTemplate.update(
                "DELETE FROM shifts WHERE id NOT IN (" +
                        "SELECT id FROM (" +
                        "  SELECT id, ROW_NUMBER() OVER (" +
                        "    PARTITION BY user_id, CAST(open_time AS DATE) " +
                        "    ORDER BY CASE WHEN status = 'CHECKED_IN' THEN 0 ELSE 1 END, open_time ASC" +
                        "  ) rn FROM shifts" +
                        ") t WHERE rn = 1)"
        );

        Map<String, Object> result = new HashMap<>();
        result.put("deletedShiftAssignments", deletedAssignments);
        result.put("deletedShiftSlots", deletedSlots);
        result.put("deletedShifts", deletedShifts);
        return result;
    }
}
