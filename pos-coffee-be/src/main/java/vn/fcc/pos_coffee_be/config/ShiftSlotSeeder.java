package vn.fcc.pos_coffee_be.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import vn.fcc.pos_coffee_be.entity.ShiftSlot;
import vn.fcc.pos_coffee_be.repository.ShiftSlotRepository;

import java.time.LocalDate;
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
        log.info("Seeding default shift slots for the next 7 days...");
        LocalDate start = LocalDate.now();
        List<ShiftSlot> defaults = new java.util.ArrayList<>();
        for (int i = 0; i <= 7; i++) {
            LocalDate d = start.plusDays(i);
            defaults.add(build("Sáng",  LocalTime.of(7, 0),  LocalTime.of(12, 0), d));
            defaults.add(build("Chiều", LocalTime.of(12, 0), LocalTime.of(17, 0), d));
            defaults.add(build("Tối",   LocalTime.of(17, 0), LocalTime.of(23, 59), d));
        }
        slotRepository.saveAll(defaults);
        log.info("Seeded {} shift slots", defaults.size());
    }

    private ShiftSlot build(String name, LocalTime start, LocalTime end, LocalDate workDate) {
        ShiftSlot slot = new ShiftSlot();
        slot.setName(name);
        slot.setStartTime(start);
        slot.setEndTime(end);
        slot.setWorkDate(workDate);
        slot.setActive(true);
        return slot;
    }
}