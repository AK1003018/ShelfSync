package com.sunbeam.library.app.config;

import com.sunbeam.library.app.entity.Member;
import com.sunbeam.library.app.enums.Role;
import com.sunbeam.library.app.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // --- Create Owner User if not exists ---
        if (memberRepository.findByEmail("owner@lib.com").isEmpty()) {
            Member owner = new Member();
            owner.setName("Owner");
            owner.setEmail("owner@lib.com");
            owner.setPassword(passwordEncoder.encode("owpassword"));
            owner.setPhone("0000000000");
            owner.setRole(Role.ROLE_OWNER);
            memberRepository.save(owner);
            System.out.println("====== Created OWNER user ======");
        }

        // --- Create Librarian User if not exists ---
        if (memberRepository.findByEmail("admin@lib.com").isEmpty()) {
            Member librarian = new Member();
            librarian.setName("Admin");
            librarian.setEmail("admin@lib.com");
            librarian.setPassword(passwordEncoder.encode("adpassword"));
            librarian.setPhone("1111111111");
            librarian.setRole(Role.ROLE_LIBRARIAN);
            memberRepository.save(librarian);
            System.out.println("====== Created LIBRARIAN user ======");
        }
    }
}