package com.genAI.eduLearn;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories
public class EduLearnApplication {

	public static void main(String[] args) {
		SpringApplication.run(EduLearnApplication.class, args);
	}

}