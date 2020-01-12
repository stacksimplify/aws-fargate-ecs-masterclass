package com.stacksimplify.usermanagement.core.repositories;

import com.stacksimplify.usermanagement.core.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface UserRepository extends JpaRepository<User, String> {

	public long countByEmail(String email);

	@Query("select u.email from User u where u.username = ?1")
	String findEmailByUsername(String username);
}