package com.genAI.eduLearn.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.genAI.eduLearn.dto.QuizResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class GoogleAIService {
    
    private final ObjectMapper objectMapper;
    private final RestTemplate restTemplate;
    
    @Value("${google.ai.api.key:AIzaSyAFroxwJlhjM82aamBVc4JRO_qGx6PBZ3Y}")
    private String apiKey;
    
    public QuizResponse generateCustomQuiz(String topic, String difficulty) {
        System.out.println("=== GENERATING CUSTOM QUIZ ===");
        System.out.println("Topic: " + topic);
        System.out.println("Difficulty: " + difficulty);
        
        try {
            String prompt = createPrompt(topic, difficulty);
            System.out.println("Prompt created: " + prompt);
            
            String response = callGoogleAI(prompt);
            System.out.println("AI Response received: " + response);
            
            QuizResponse quiz = parseQuizResponse(response, topic, difficulty);
            System.out.println("Quiz parsed successfully with " + quiz.getQuestions().size() + " questions");
            
            return quiz;
        } catch (Exception e) {
            System.err.println("Error generating custom quiz: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to generate custom quiz: " + e.getMessage(), e);
        }
    }
    
    private String createPrompt(String topic, String difficulty) {
        return String.format(
            "Create 3 %s difficulty multiple choice questions about %s. " +
            "Return only this JSON format: " +
            "{\"questions\": [{\"question\": \"What is...\", \"options\": [\"answer1\", \"answer2\", \"answer3\", \"answer4\"], \"correct\": 0}]} " +
            "Make questions specific to %s topic. Each question needs 4 different options with only 1 correct answer.",
            difficulty.toLowerCase(), topic, topic
        );
    }
    
    private String callGoogleAI(String prompt) {
        Map<String, Object> requestBody = Map.of(
            "contents", List.of(
                Map.of("parts", List.of(
                    Map.of("text", prompt)
                ))
            ),
            "generationConfig", Map.of(
                "temperature", 0.7,
                "maxOutputTokens", 2048
            )
        );
        
        try {
            System.out.println("Making API call to Google AI...");
            
            HttpHeaders headers = new HttpHeaders();
            headers.set("Content-Type", "application/json");
            
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            
            String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + apiKey;
            
            ResponseEntity<String> response = restTemplate.exchange(
                url, HttpMethod.POST, entity, String.class
            );
            
            System.out.println("Raw API response: " + response.getBody());
            
            JsonNode jsonResponse = objectMapper.readTree(response.getBody());
            String textResponse = jsonResponse.path("candidates").get(0)
                .path("content").path("parts").get(0)
                .path("text").asText();
                
            System.out.println("Extracted text: " + textResponse);
            return textResponse;
        } catch (Exception e) {
            System.err.println("Google AI API call failed: " + e.getMessage());
            e.printStackTrace();
            
            // Return fallback response for testing
            return createMockAIResponse(prompt);
        }
    }
    
    private String createMockAIResponse(String prompt) {
        System.out.println("Creating mock AI response for testing...");
        // Extract topic from prompt for better mock questions
        String topic = "general knowledge";
        if (prompt.toLowerCase().contains("javascript")) {
            return createJavaScriptQuestions();
        } else if (prompt.toLowerCase().contains("java")) {
            return createJavaQuestions();
        } else if (prompt.toLowerCase().contains("python")) {
            return createPythonQuestions();
        } else if (prompt.toLowerCase().contains("history")) {
            return createHistoryQuestions();
        } else if (prompt.toLowerCase().contains("math")) {
            return createMathQuestions();
        }
        
        return "{\"questions\": [" +
            "{\"question\": \"What is a key concept in learning?\", \"options\": [\"Practice and understanding\", \"Memorization only\", \"Avoiding challenges\", \"Skipping basics\"], \"correct\": 0}," +
            "{\"question\": \"Which approach helps in problem solving?\", \"options\": [\"Giving up quickly\", \"Breaking down problems\", \"Avoiding difficult tasks\", \"Working without planning\"], \"correct\": 1}," +
            "{\"question\": \"What is important for success?\", \"options\": [\"Luck only\", \"Natural talent only\", \"Consistent effort\", \"Avoiding mistakes\"], \"correct\": 2}" +
            "]}";
    }
    
    private String createJavaScriptQuestions() {
        return "{\"questions\": [" +
            "{\"question\": \"What is the correct way to declare a variable in JavaScript?\", \"options\": [\"let x = 5;\", \"variable x = 5;\", \"declare x = 5;\", \"x := 5;\"], \"correct\": 0}," +
            "{\"question\": \"Which method is used to add an element to the end of an array?\", \"options\": [\"append()\", \"push()\", \"add()\", \"insert()\"], \"correct\": 1}," +
            "{\"question\": \"What does '===' operator do in JavaScript?\", \"options\": [\"Assignment\", \"Loose equality\", \"Strict equality\", \"Not equal\"], \"correct\": 2}" +
            "]}";
    }
    
    private String createJavaQuestions() {
        return "{\"questions\": [" +
            "{\"question\": \"Which keyword is used to create a class in Java?\", \"options\": [\"class\", \"Class\", \"create\", \"new\"], \"correct\": 0}," +
            "{\"question\": \"What is the main method signature in Java?\", \"options\": [\"main(String args)\", \"public static void main(String[] args)\", \"void main()\", \"static main(String args)\"], \"correct\": 1}," +
            "{\"question\": \"Which access modifier makes a member accessible only within the same class?\", \"options\": [\"public\", \"protected\", \"private\", \"default\"], \"correct\": 2}" +
            "]}";
    }
    
    private String createPythonQuestions() {
        return "{\"questions\": [" +
            "{\"question\": \"How do you create a list in Python?\", \"options\": [\"list = [1, 2, 3]\", \"list = (1, 2, 3)\", \"list = {1, 2, 3}\", \"list = <1, 2, 3>\"], \"correct\": 0}," +
            "{\"question\": \"Which function is used to get the length of a list?\", \"options\": [\"size()\", \"len()\", \"length()\", \"count()\"], \"correct\": 1}," +
            "{\"question\": \"What is the correct way to define a function in Python?\", \"options\": [\"function myFunc():\", \"def myFunc():\", \"create myFunc():\", \"func myFunc():\"], \"correct\": 1}" +
            "]}";
    }
    
    private String createHistoryQuestions() {
        return "{\"questions\": [" +
            "{\"question\": \"In which year did World War II end?\", \"options\": [\"1945\", \"1944\", \"1946\", \"1943\"], \"correct\": 0}," +
            "{\"question\": \"Who was the first President of the United States?\", \"options\": [\"Thomas Jefferson\", \"George Washington\", \"John Adams\", \"Benjamin Franklin\"], \"correct\": 1}," +
            "{\"question\": \"The Renaissance period began in which country?\", \"options\": [\"France\", \"Germany\", \"Italy\", \"England\"], \"correct\": 2}" +
            "]}";
    }
    
    private String createMathQuestions() {
        return "{\"questions\": [" +
            "{\"question\": \"What is 15 + 27?\", \"options\": [\"42\", \"41\", \"43\", \"40\"], \"correct\": 0}," +
            "{\"question\": \"What is the square root of 64?\", \"options\": [\"6\", \"8\", \"10\", \"7\"], \"correct\": 1}," +
            "{\"question\": \"What is 12 × 9?\", \"options\": [\"106\", \"107\", \"108\", \"109\"], \"correct\": 2}" +
            "]}";
    }
    
    private QuizResponse parseQuizResponse(String aiResponse, String topic, String difficulty) {
        try {
            System.out.println("Parsing AI response: " + aiResponse);
            
            // Extract JSON from AI response
            String jsonStr = aiResponse.trim();
            
            // Handle markdown code blocks
            if (jsonStr.contains("```json")) {
                int startIndex = jsonStr.indexOf("```json") + 7;
                int endIndex = jsonStr.indexOf("```", startIndex);
                if (endIndex > startIndex) {
                    jsonStr = jsonStr.substring(startIndex, endIndex).trim();
                }
            } else if (jsonStr.contains("```")) {
                int startIndex = jsonStr.indexOf("```") + 3;
                int endIndex = jsonStr.indexOf("```", startIndex);
                if (endIndex > startIndex) {
                    jsonStr = jsonStr.substring(startIndex, endIndex).trim();
                }
            }
            
            // Find JSON object if it's embedded in text
            if (!jsonStr.startsWith("{")) {
                int jsonStart = jsonStr.indexOf("{");
                if (jsonStart >= 0) {
                    jsonStr = jsonStr.substring(jsonStart);
                }
            }
            
            System.out.println("Cleaned JSON string: " + jsonStr);
            
            JsonNode jsonNode = objectMapper.readTree(jsonStr);
            JsonNode questionsNode = jsonNode.path("questions");
            
            if (questionsNode.isMissingNode() || !questionsNode.isArray()) {
                throw new RuntimeException("Invalid response format: questions array not found");
            }
            
            QuizResponse quiz = new QuizResponse();
            quiz.setId(-1L); // Temporary ID for custom quiz
            quiz.setTitle("Custom Quiz: " + topic);
            quiz.setDescription("AI-generated " + difficulty.toLowerCase() + " level quiz on " + topic);
            quiz.setXpReward(100);
            quiz.setTotalMarks(Math.min(questionsNode.size(), 10));
            
            List<QuizResponse.QuestionResponse> questions = new ArrayList<>();
            
            for (int i = 0; i < Math.min(questionsNode.size(), 10); i++) {
                JsonNode questionNode = questionsNode.get(i);
                
                QuizResponse.QuestionResponse question = new QuizResponse.QuestionResponse();
                question.setId((long) (i + 1));
                question.setQuestionText(questionNode.path("question").asText());
                question.setMarks(1);
                
                List<QuizResponse.OptionResponse> options = new ArrayList<>();
                JsonNode optionsNode = questionNode.path("options");
                int correctIndex = questionNode.path("correct").asInt(0);
                
                if (optionsNode.isArray() && optionsNode.size() > 0) {
                    for (int j = 0; j < optionsNode.size(); j++) {
                        QuizResponse.OptionResponse option = new QuizResponse.OptionResponse();
                        option.setId((long) (j + 1));
                        option.setOptionText(optionsNode.get(j).asText());
                        option.setIsCorrect(j == correctIndex);
                        options.add(option);
                    }
                } else {
                    // Fallback: create default options if parsing fails
                    for (int j = 0; j < 4; j++) {
                        QuizResponse.OptionResponse option = new QuizResponse.OptionResponse();
                        option.setId((long) (j + 1));
                        option.setOptionText("Option " + (char)('A' + j));
                        option.setIsCorrect(j == 0); // First option is correct by default
                        options.add(option);
                    }
                }
                
                question.setOptions(options);
                questions.add(question);
            }
            
            if (questions.isEmpty()) {
                throw new RuntimeException("No valid questions found in AI response");
            }
            
            quiz.setQuestions(questions);
            System.out.println("Successfully parsed " + questions.size() + " questions");
            return quiz;
            
        } catch (Exception e) {
            System.err.println("Failed to parse AI response: " + e.getMessage());
            e.printStackTrace();
            
            // Return a fallback quiz if parsing fails
            return createFallbackQuiz(topic, difficulty);
        }
    }
    
    private QuizResponse createFallbackQuiz(String topic, String difficulty) {
        System.out.println("Creating fallback quiz for topic: " + topic);
        
        // Use the same topic-specific logic as mock response
        String mockResponse = createMockAIResponse("Generate questions about " + topic);
        try {
            return parseQuizResponse(mockResponse, topic, difficulty);
        } catch (Exception e) {
            // If parsing fails, create basic fallback
            QuizResponse quiz = new QuizResponse();
            quiz.setId(-1L);
            quiz.setTitle("Custom Quiz: " + topic);
            quiz.setDescription("AI-generated " + difficulty.toLowerCase() + " level quiz on " + topic);
            quiz.setXpReward(100);
            quiz.setTotalMarks(3);
            
            List<QuizResponse.QuestionResponse> questions = new ArrayList<>();
            
            QuizResponse.QuestionResponse q1 = new QuizResponse.QuestionResponse();
            q1.setId(1L);
            q1.setQuestionText("What is a key concept in " + topic + "?");
            q1.setMarks(1);
            
            List<QuizResponse.OptionResponse> options1 = new ArrayList<>();
            options1.add(createOption(1L, "Fundamental principles", true));
            options1.add(createOption(2L, "Random facts", false));
            options1.add(createOption(3L, "Unrelated topics", false));
            options1.add(createOption(4L, "Complex theories", false));
            q1.setOptions(options1);
            questions.add(q1);
            
            quiz.setQuestions(questions);
            return quiz;
        }
    }
    
    private QuizResponse.OptionResponse createOption(Long id, String text, boolean isCorrect) {
        QuizResponse.OptionResponse option = new QuizResponse.OptionResponse();
        option.setId(id);
        option.setOptionText(text);
        option.setIsCorrect(isCorrect);
        return option;
    }
}