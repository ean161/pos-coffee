package vn.fcc.pos_coffee_be;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class PosCoffeeBeApplication {

	public static void main(String[] args) {
		SpringApplication.run(PosCoffeeBeApplication.class, args);
	}

}
