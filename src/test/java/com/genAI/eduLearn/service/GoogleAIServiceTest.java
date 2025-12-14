package com.genAI.eduLearn.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.genAI.eduLearn.dto.QuizResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.client.RestTemplate;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class GoogleAIServiceTest {

    @Mock
    private ObjectMapper objectMapper;

    @Mock
    private RestTemplate restTemplate;

    @InjectMocks
    private GoogleAIService googleAIService;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(googleAIService, "apiKey", "test-api-key");
    }

    @Test
    void generateCustomQuiz_WithJavaScript_ReturnsJavaScriptQuestions() {
        String topic = "JavaScript";
        String difficulty = "EASY";

        QuizResponse result = googleAIService.generateCustomQuiz(topic, difficulty);

        assertNotNull(result);
        assertEquals("Custom Quiz: " + topic, result.getTitle());
        assertEquals(100, result.getXpReward());
        assertEquals(3, result.getQuestions().size());
    }

    @Test
    void generateCustomQuiz_WithJava_ReturnsJavaQuestions() {
        String topic = "Java";
        String difficulty = "HARD";

        QuizResponse result = googleAIService.generateCustomQuiz(topic, difficulty);

        assertNotNull(result);
        assertEquals(3, result.getQuestions().size());
        result.getQuestions().forEach(question -> {
            assertEquals(4, question.getOptions().size());
            long correctCount = question.getOptions().stream()
                    .mapToLong(option -> option.getIsCorrect() ? 1 : 0)
                    .sum();
            assertEquals(1, correctCount);
        });
    }

    @Test
    void generateCustomQuiz_WithPython_ReturnsPythonQuestions() {
        String topic = "Python";
        String difficulty = "MEDIUM";

        QuizResponse result = googleAIService.generateCustomQuiz(topic, difficulty);

        assertNotNull(result);
        assertEquals(3, result.getQuestions().size());
    }

    @Test
    void generateCustomQuiz_WithHistory_ReturnsHistoryQuestions() {
        String topic = "History";
        String difficulty = "EASY";

        QuizResponse result = googleAIService.generateCustomQuiz(topic, difficulty);

        assertNotNull(result);
        assertEquals(3, result.getQuestions().size());
    }

    @Test
    void generateCustomQuiz_WithMath_ReturnsMathQuestions() {
        String topic = "Math";
        String difficulty = "HARD";

        QuizResponse result = googleAIService.generateCustomQuiz(topic, difficulty);

        assertNotNull(result);
        assertEquals(3, result.getQuestions().size());
    }

    @Test
    void generateCustomQuiz_WithUnknownTopic_ReturnsGeneralQuestions() {
        String topic = "UnknownTopic";
        String difficulty = "MEDIUM";

        QuizResponse result = googleAIService.generateCustomQuiz(topic, difficulty);

        assertNotNull(result);
        assertEquals("Custom Quiz: " + topic, result.getTitle());
        assertEquals(3, result.getQuestions().size());
    }
}