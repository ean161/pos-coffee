package vn.fcc.pos_coffee_be.exception;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

    // Trả về 404
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<String> handleNotFound(ResourceNotFoundException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
    }

    // Trả về 409 (Dữ liệu đã tồn tại)
    @ExceptionHandler(ConflictException.class)
    public ResponseEntity<String> handleConflict(ConflictException e) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
    }

    // Trả về 409 khi vi phạm unique/FK constraint của SQL Server
    // thay vì để nổ 500 với message thô của Hibernate.
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<String> handleDataIntegrity(DataIntegrityViolationException e) {
        String msg = "Dữ liệu vi phạm ràng buộc (unique/foreign key). Vui lòng kiểm tra lại.";
        Throwable root = e.getMostSpecificCause();
        if (root != null && root.getMessage() != null) {
            msg = msg + " Chi tiết: " + root.getMessage();
        }
        return ResponseEntity.status(HttpStatus.CONFLICT).body(msg);
    }

    // Trả về 400 cho các lỗi nghiệp vụ khác
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<String> handleRuntimeException(RuntimeException e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }
}