package com.stacksimplify.usermanagement.core.controllers;

import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.Arrays;
import java.util.List;

import javax.validation.Valid;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;

import com.stacksimplify.usermanagement.core.dtos.EmailMessage;
import com.stacksimplify.usermanagement.core.entities.User;
import com.stacksimplify.usermanagement.core.repositories.UserRepository;

@RestController
@RequestMapping("/usermgmt")
public class UserController {

    private static final Log logger = LogFactory.getLog(UserController.class);

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private Environment env;

    @GetMapping("/users")
    @ResponseStatus(HttpStatus.OK)
    public List<User> listAllUsers() {
        return userRepository.findAll();
    }

    @GetMapping("/user/{username}")
    @ResponseStatus(HttpStatus.OK)
    public User getUserByUsername(@PathVariable("username") String userName) {
        return userRepository.findById(userName)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        String.format("User with user name %s doesn't exist!", userName)));
    }

    @PostMapping("/user")
    @ResponseStatus(HttpStatus.OK)
    public void createUser(@RequestBody @Valid User user) {

        if (userRepository.findById(user.getUsername()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    String.format("User with user name %s already exists!", user.getUsername()));
        }
        if (userRepository.countByEmail(user.getEmail()) != 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    String.format("User with email %s already exists!", user.getEmail()));
        }
        userRepository.save(user);
        sendAccountActivationNotifications(user);
    }

    @PutMapping("/user")
    @ResponseStatus(HttpStatus.OK)
    public void updateUser(@RequestBody @Valid User user) {

        User u = userRepository.findById(user.getUsername())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        String.format("User with user name %s doesn't exist!", user.getUsername())));

        // check email unique.
        if (u.getEmail().trim().equalsIgnoreCase(user.getEmail().trim()) == false
                && userRepository.countByEmail(user.getEmail()) != 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    String.format("User with email %s already exists!", user.getEmail()));
        }

        u.setEmail(user.getEmail());
        u.setFirstname(user.getFirstname());
        u.setLastname(user.getLastname());
        userRepository.save(u);
    }

    @DeleteMapping("/user/{username}")
    @ResponseStatus(HttpStatus.OK)
    public void deleteUser(@PathVariable("username") String userName) {

        if (userRepository.findById(userName).isPresent()) {
            userRepository.deleteById(userName);
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                    String.format("User with user name %s doesn't exist!", userName));
        }
    }

    public void sendAccountActivationNotifications(User user) {
        // Send Email Notifications
        String userEmailContent = String.format("Hello %s, your stack simplify account is created successfully!", user.getFirstname());

		EmailMessage message = new EmailMessage();
		message.setSubject("Stack Simplify account creation.");
		message.setContent(userEmailContent);
		message.setToEmails(Arrays.asList(user.getEmail()));

		RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setAccept(Arrays.asList(MediaType.APPLICATION_JSON));
        HttpEntity<EmailMessage> entity = new HttpEntity<>(message, headers);
        //restTemplate.exchange("http://localhost:8096/notification/send", HttpMethod.POST, entity, Void.class);
        logger.info("Notification Service URL: " + env.getProperty("notification.service.url"));
        restTemplate.exchange(env.getProperty("notification.service.url"), HttpMethod.POST, entity, Void.class);

    }

    
	@GetMapping("/health-status")
	public String healthStatus(){
		return "User Management Service UP and RUNNING";
		
	}
	

	
	@GetMapping("/notification-service-info")
    public ResponseEntity<String> fromNotificationService() {

		RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setAccept(Arrays.asList(MediaType.APPLICATION_JSON));
        HttpEntity<String> entity = new HttpEntity<>(headers);
        logger.info("Notification Service URL: " + env.getProperty("notification.service.info.url"));
        ResponseEntity<String> result = restTemplate.exchange(env.getProperty("notification.service.info.url"), HttpMethod.GET, entity, String.class);
        return result;

    }
}
