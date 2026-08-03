# Spring Boot Integration

This folder contains Spring Boot integration code for the AI Interview Engine.

## Files

- `AIInterviewClient.java` - Main client service for calling the AI Interview Engine API
- `RestTemplateConfig.java` - RestTemplate configuration with timeouts
- `InterviewController.java` - Example REST controller using the client
- `application.yml` - Configuration properties

## Setup

### 1. Add Dependencies

Add to your `pom.xml`:

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
</dependencies>
```

### 2. Copy Files

Copy these files to your Spring Boot project:

```
src/main/java/com/example/interview/
├── client/
│   └── AIInterviewClient.java
├── config/
│   └── RestTemplateConfig.java
└── controller/
    └── InterviewController.java

src/main/resources/
└── application.yml
```

### 3. Configure

Edit `application.yml` to point to your AI service:

```yaml
ai:
  service:
    base-url: http://localhost:8000
```

## Usage Examples

### Inject the Client

```java
@Service
public class InterviewService {
    
    private final AIInterviewClient aiClient;
    
    public InterviewService(AIInterviewClient aiClient) {
        this.aiClient = aiClient;
    }
    
    public void evaluateInterview(Interview interview) {
        // Build request
        var request = new AIInterviewClient.AnswerEvaluationRequest();
        request.setCandidateId(interview.getCandidateId());
        request.setJobRole(interview.getJobRole());
        request.setQuestionText(interview.getQuestion());
        request.setIdealAnswer(interview.getIdealAnswer());
        request.setKeyPoints(interview.getKeyPoints());
        request.setCandidateAnswer(interview.getCandidateAnswer());
        
        // Call AI service
        var score = aiClient.evaluateAnswer(request);
        
        // Process results
        System.out.println("Overall Score: " + score.getOverallScore());
        System.out.println("Strengths: " + score.getStrengths());
    }
}
```

### Transcribe Audio

```java
@PostMapping("/upload-answer")
public ResponseEntity<?> uploadAnswer(@RequestParam("audio") MultipartFile audio) {
    try {
        STTResponse transcript = aiClient.transcribeAudio(audio);
        return ResponseEntity.ok(transcript.getText());
    } catch (IOException e) {
        return ResponseEntity.badRequest().body("Failed to process audio");
    }
}
```

### Generate Summary

```java
public void generateInterviewReport(int sessionId) {
    var request = new AIInterviewClient.SummaryRequest();
    request.setCandidateName("John Doe");
    request.setJobRole("Software Engineer");
    request.setInterviewSessionId(sessionId);
    request.setEvaluations(getAllEvaluations(sessionId));
    
    var summary = aiClient.generateSummary(request);
    
    System.out.println("Rating: " + summary.getOverallRating10() + "/10");
    System.out.println("PDF: " + summary.getPdfPath());
    System.out.println("Recommendation: " + summary.getRecommendation());
}
```

### Adaptive Difficulty

```java
public String getNextQuestionDifficulty(int sessionId) {
    var request = new AIInterviewClient.AdaptiveRequest();
    request.setJobRole("Software Engineer");
    request.setRecentHistory(getRecentPerformance(sessionId));
    
    var response = aiClient.getNextDifficulty(request);
    
    System.out.println("Next: " + response.getNextDifficulty());
    System.out.println("Reason: " + response.getReason());
    
    return response.getNextDifficulty();
}
```

## Error Handling

Add global exception handler:

```java
@ControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(RestClientException.class)
    public ResponseEntity<String> handleRestClientException(RestClientException e) {
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                .body("AI service unavailable: " + e.getMessage());
    }
}
```

## Testing

Make sure the Python AI service is running on `http://localhost:8000` before testing your Spring Boot application.

```bash
# Start Python service
cd ai-interview-engine
python -m app.main

# Start Spring Boot app
./mvnw spring-boot:run
```

Test endpoints:
```bash
curl http://localhost:8080/api/interview/health
```
