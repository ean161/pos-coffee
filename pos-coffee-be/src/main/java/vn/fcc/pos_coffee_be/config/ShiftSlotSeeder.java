package vn.fcc.pos_coffee_be.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import vn.fcc.pos_coffee_be.entity.ShiftSlot;
import vn.fcc.pos_coffee_be.repository.ShiftSlotRepository;

import java.time.LocalTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class ShiftSlotSeeder implements CommandLineRunner {

    private final ShiftSlotRepository slotRepository;

    @Override
    public void run(String... args) {
        if (slotRepository.count() > 0) {
            return;
        }
        log.info("Seeding default shift slots...");
        List<ShiftSlot> defaults = List.of(
                build("Sáng", LocalTime.of(6, 0), LocalTime.of(12, 0)),
                build("Chiều", LocalTime.of(12, 0), LocalTime.of(18, 0)),
                build("Tối", LocalTime.of(18, 0), LocalTime.of(22, 0))
        );
        slotRepository.saveAll(defaults);
        log.info("Seeded {} shift slots", defaults.size());
    }

    private ShiftSlot build(String name, LocalTime start, LocalTime end) {
        ShiftSlot slot = new ShiftSlot();
        slot.setName(name);
        slot.setStartTime(start);
        slot.setEndTime(end);
        slot.setActive(true);
        return slot;
    }
}
