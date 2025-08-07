package com.sunbeam.library.app.service;

import com.sunbeam.library.app.dto.RegisterRequestDTO;
import com.sunbeam.library.app.entity.Member;
import com.sunbeam.library.app.enums.Role;
import com.sunbeam.library.app.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Member registerNewMember(RegisterRequestDTO request) {
        if (memberRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email is already registered");
        }

        Member member = new Member();
        member.setName(request.getName());
        member.setEmail(request.getEmail());
        member.setPhone(request.getPhone());
        member.setPassword(passwordEncoder.encode(request.getPassword()));
        // By default, new registrations are Members
        member.setRole(Role.ROLE_MEMBER); 

        return memberRepository.save(member);
    }
}