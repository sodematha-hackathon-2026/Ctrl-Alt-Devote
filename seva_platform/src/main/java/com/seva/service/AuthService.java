package com.seva.service;

import com.seva.entity.Users;
import com.seva.repository.UsersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsersRepository usersRepository;

    @Transactional
    public Users registerOrUpdateUser(Users userRequest) {
        Optional<Users> existingUserOpt = usersRepository.findByPhoneNumber(userRequest.getPhoneNumber());

        if (existingUserOpt.isPresent()) {
            Users user = existingUserOpt.get();
            // Update fields only if they are not null
            if (userRequest.getFullName() != null)
                user.setFullName(userRequest.getFullName());
            if (userRequest.getEmail() != null)
                user.setEmail(userRequest.getEmail());
            if (userRequest.getGothra() != null)
                user.setGothra(userRequest.getGothra());
            if (userRequest.getRashi() != null)
                user.setRashi(userRequest.getRashi());
            if (userRequest.getNakshatra() != null)
                user.setNakshatra(userRequest.getNakshatra());
            if (userRequest.getAddress() != null)
                user.setAddress(userRequest.getAddress());
            if (userRequest.getCity() != null)
                user.setCity(userRequest.getCity());
            if (userRequest.getState() != null)
                user.setState(userRequest.getState());
            if (userRequest.getPincode() != null)
                user.setPincode(userRequest.getPincode());
            if (userRequest.getConsentDataStorage() != null)
                user.setConsentDataStorage(userRequest.getConsentDataStorage());
            if (userRequest.getConsentCommunications() != null)
                user.setConsentCommunications(userRequest.getConsentCommunications());
            if (userRequest.getFcmToken() != null)
                user.setFcmToken(userRequest.getFcmToken());

            // Prevent users from self-approving as volunteer
            // if (userRequest.getIsVolunteer() != null)
            // user.setIsVolunteer(userRequest.getIsVolunteer());

            // Allow updating volunteerRequest if provided
            if (userRequest.getVolunteerRequest() != null)
                user.setVolunteerRequest(userRequest.getVolunteerRequest());

            return usersRepository.save(user);
        } else {
            // New User
            userRequest.setRole(Users.Role.USER);
            userRequest.setIsAdmin(false);
            if (userRequest.getIsVolunteer() == null)
                userRequest.setIsVolunteer(false);
            if (userRequest.getVolunteerRequest() == null)
                userRequest.setVolunteerRequest(false);
            return usersRepository.save(userRequest);
        }
    }

    public Optional<Users> findByPhoneNumber(String phoneNumber) {
        return usersRepository.findByPhoneNumber(phoneNumber);
    }
}
