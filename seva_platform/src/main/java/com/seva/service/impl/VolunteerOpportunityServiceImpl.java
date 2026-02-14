package com.seva.service.impl;

import com.seva.entity.VolunteerOpportunity;
import com.seva.repository.VolunteerOpportunityRepository;
import com.seva.service.VolunteerOpportunityService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.seva.repository.VolunteerApplicationRepository;
import com.seva.repository.UsersRepository;
import org.springframework.transaction.annotation.Transactional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class VolunteerOpportunityServiceImpl implements VolunteerOpportunityService {

    private final VolunteerOpportunityRepository repository;
    private final VolunteerApplicationRepository applicationRepository;
    private final UsersRepository usersRepository;

    @Override
    public java.util.List<VolunteerOpportunity> getOpenOpportunities() {
        return repository.findByStatusOrderByCreatedAtDesc(VolunteerOpportunity.Status.OPEN);
    }

    @Override
    public java.util.List<VolunteerOpportunity> getAllOpportunities() {
        return repository.findAll();
    }

    @Override
    public VolunteerOpportunity createOpportunity(VolunteerOpportunity opportunity) {
        return repository.save(opportunity);
    }

    @Override
    public VolunteerOpportunity updateOpportunity(UUID id, VolunteerOpportunity opportunity) {
        VolunteerOpportunity existing = getOpportunityById(id);
        existing.setTitle(opportunity.getTitle());
        existing.setDescription(opportunity.getDescription());
        existing.setRequiredSkills(opportunity.getRequiredSkills());
        existing.setImageUrl(opportunity.getImageUrl());
        existing.setStatus(opportunity.getStatus());
        return repository.save(existing);
    }

    @Override
    public void deleteOpportunity(UUID id) {
        repository.deleteById(id);
    }

    @Override
    public VolunteerOpportunity getOpportunityById(UUID id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Opportunity not found with id: " + id));
    }

    @Override
    public void applyForOpportunity(UUID id, String phoneNumber) {
        VolunteerOpportunity opportunity = getOpportunityById(id);
        com.seva.entity.Users user = usersRepository.findByPhoneNumber(phoneNumber)
                .orElseThrow(() -> new RuntimeException("User not found with phone: " + phoneNumber));

        // Check if already applied
        if (applicationRepository.findByUserIdAndOpportunityId(user.getId(), id).isPresent()) {
            throw new RuntimeException("User has already applied for this opportunity");
        }

        com.seva.entity.VolunteerApplication application = new com.seva.entity.VolunteerApplication();
        application.setUser(user);
        application.setOpportunity(opportunity);
        applicationRepository.save(application);

        // Update application count
        opportunity.setApplicationCount(opportunity.getApplicationCount() + 1);
        repository.save(opportunity);
    }

    @Override
    public java.util.List<com.seva.entity.VolunteerApplication> getApplicationsForOpportunity(UUID opportunityId) {
        return applicationRepository.findByOpportunityId(opportunityId);
    }

    @Override
    public com.seva.entity.VolunteerApplication updateApplicationStatus(UUID applicationId,
            com.seva.entity.VolunteerApplication.Status status) {
        com.seva.entity.VolunteerApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found with id: " + applicationId));

        application.setStatus(status);

        return applicationRepository.save(application);
    }

    @Override
    public java.util.List<com.seva.entity.VolunteerApplication> getMyApplications(String phoneNumber) {
        com.seva.entity.Users user = usersRepository.findByPhoneNumber(phoneNumber)
                .orElseThrow(() -> new RuntimeException("User not found with phone: " + phoneNumber));
        return applicationRepository.findByUserId(user.getId());
    }
}
