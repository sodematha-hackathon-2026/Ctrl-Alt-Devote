package com.seva.service;

import com.seva.dto.VolunteerDTO;
import com.seva.entity.Users;
import com.seva.entity.Volunteer;
import com.seva.repository.UsersRepository;
import com.seva.repository.VolunteerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class VolunteerService {

    private final VolunteerRepository volunteerRepository;
    private final UsersRepository usersRepository;

    @Transactional
    public Volunteer registerVolunteer(VolunteerDTO volunteerDTO) {
        Users user = usersRepository.findById(volunteerDTO.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Optional<Volunteer> existingVolunteer = volunteerRepository.findByUserId(volunteerDTO.getUserId());
        if (existingVolunteer.isPresent()) {
            throw new RuntimeException("User is already registered as a volunteer");
        }

        Volunteer volunteer = new Volunteer();
        volunteer.setUser(user);
        volunteer.setName(volunteerDTO.getName());
        volunteer.setPhoneNumber(volunteerDTO.getPhoneNumber());
        volunteer.setEmail(volunteerDTO.getEmail());
        volunteer.setHobbiesOrTalents(volunteerDTO.getHobbiesOrTalents());
        volunteer.setPastExperience(volunteerDTO.getPastExperience());

        // Update user status
        user.setIsVolunteer(true);
        usersRepository.save(user);

        return volunteerRepository.save(volunteer);
    }

    public Volunteer getVolunteerByUserId(UUID userId) {
        return volunteerRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Volunteer details not found for user"));
    }
}
