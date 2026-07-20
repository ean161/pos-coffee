package vn.fcc.pos_coffee_be.exception;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.MethodArgumentNotValidException;

import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<Map<String, String>> handleAuthentication(AuthenticationException e) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "Tên đăng nhập hoặc mật khẩu không chính xác."));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidation(MethodArgumentNotValidException e) {
        String message = e.getBindingResult().getFieldErrors().stream()
                .findFirst()
                .map(error -> error.getDefaultMessage() != null
                        ? error.getDefaultMessage()
                        : "Dữ liệu không hợp lệ.")
                .orElse("Dữ liệu không hợp lệ.");
        return ResponseEntity.badRequest().body(Map.of("message", message));
    }

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
