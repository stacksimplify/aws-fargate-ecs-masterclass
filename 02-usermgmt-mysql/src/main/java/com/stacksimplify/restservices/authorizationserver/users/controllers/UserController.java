package com.stacksimplify.restservices.authorizationserver.users.controllers;

import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

import javax.validation.Valid;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.util.Assert;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.stacksimplify.restservices.authorizationserver.users.dtos.UserModel;
import com.stacksimplify.restservices.authorizationserver.users.entities.User;
import com.stacksimplify.restservices.authorizationserver.users.repositories.UserRepository;
import com.stacksimplify.restservices.authorizationserver.users.services.UserService;

@RestController
public class UserController {

	private static final Log logger = LogFactory.getLog(UserController.class);

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private BCryptPasswordEncoder passwordEncoder;

	@Autowired
	private UserService userService;

	// @PreAuthorize("hasAnyRole('ROLE_MODERATOR','ROLE_ADMIN')")
	@GetMapping("/users")
	@ResponseStatus(HttpStatus.OK)
	public List<UserModel> listAllUsers() {
		List<User> users = userRepository.findAll();
		List<UserModel> filteredUsers = users.stream().map(u -> {
			UserModel user = new UserModel();
			user.setUsername(u.getUsername());
			user.setEmail(u.getEmail());
			user.setRole(u.getAuthorities().stream().findFirst().get().getAuthority());
			user.setEnabled(u.isEnabled());
			user.setFirstname(u.getFirstname());
			user.setLastname(u.getLastname());
			user.setAppversion("V1");
			return user;
		}).collect(Collectors.toList());
		return filteredUsers;
	}

	@PreAuthorize("hasAnyRole('ROLE_MODERATOR','ROLE_ADMIN')")
	@GetMapping("/user/{username}")
	@ResponseStatus(HttpStatus.OK)
	public UserModel getUserByUsername(@PathVariable("username") String userName) {

		User user = userRepository.findById(userName)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
						String.format("User with user name %s doesn't exist!", userName)));

		UserModel userModel = new UserModel();
		userModel.setUsername(user.getUsername());
		userModel.setEmail(user.getEmail());
		userModel.setFirstname(user.getFirstname());
		userModel.setLastname(user.getLastname());
		userModel.setEnabled(user.isEnabled());
		userModel.setRole(user.getAuthorities().stream().findFirst().get().getAuthority());
		return userModel;
	}

	@PreAuthorize("hasAnyRole('ROLE_ADMIN')")
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
		if (userService.matchesPolicy(user.getPassword()) == false) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
					String.format("User Password is invalid", user.getPassword()));
		}
		user.setPassword(passwordEncoder.encode(user.getPassword()));
		userRepository.save(user);
	}

	@PreAuthorize("hasAnyRole('ROLE_ADMIN')")
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

	@PreAuthorize("hasAnyRole('ROLE_ADMIN')")
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

	@PreAuthorize("hasAnyRole('ROLE_ADMIN')")
	@GetMapping("/status/{username}")
	@ResponseStatus(HttpStatus.OK)
	public void changeUserStatus(@PathVariable("username") String userName) {

		User user = userRepository.findById(userName)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
						String.format("User with user name %s doesn't exist!", userName)));

		boolean state = !user.isEnabled();
		user.setEnabled(state);
		userRepository.save(user);
	}

	@PostMapping("/public/register")
	@ResponseStatus(HttpStatus.OK)
	public ResponseEntity<?> registerUser(@RequestBody @Valid User user) {

		// check if user with same name or email doesn't exist.
		if (userRepository.findById(user.getUsername()).isPresent()) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
					String.format("User with user name %s already exists!", user.getUsername()));
		}
		if (userRepository.countByEmail(user.getEmail()) != 0) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
					String.format("User with email %s already exists!", user.getEmail()));
		}
		if (userService.matchesPolicy(user.getPassword()) == false) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
					String.format("User Password is invalid", user.getPassword()));
		}


		user.setRole("ROLE_USER"); // registering users will always have role ROLE_USER.
		user.setPassword(passwordEncoder.encode(user.getPassword()));
		user.setEnabled(false);
		userRepository.save(user);
		
		HashMap<String, String> response = new HashMap<>();
		response.put("message",
				"Thank you for registering with StackSimplify User Management,  "
						+ "your account is created successfully and is pending activation,  "
						+ "you will be able to login once admin approve's and activates your account. ");
		return ResponseEntity.status(200).body(response);
	
	}

	@PreAuthorize("hasAnyRole('ROLE_ADMIN')")
	@GetMapping("/user/activate/{username}")
	@ResponseStatus(HttpStatus.OK)
	public void activateUser(@PathVariable("username") String userName) {

		User user = userRepository.findById(userName)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
						"User with user name " + userName + " doesn't exist!"));

		// if user account is not already activated, activate user account.
		Assert.isTrue(user.isEnabled() == false, "User already activated!");

		user.setEnabled(true);
		userRepository.save(user);

	}

}
