package com.seva.service;

import com.seva.entity.VolunteerOpportunity;
import com.seva.entity.VolunteerApplication;
import java.util.List;
import java.util.UUID;

public interface VolunteerOpportunityService {
    List<VolunteerOpportunity> getOpenOpportunities();

    List<VolunteerOpportunity> getAllOpportunities();

    VolunteerOpportunity createOpportunity(VolunteerOpportunity opportunity);

    VolunteerOpportunity updateOpportunity(UUID id, VolunteerOpportunity opportunity);

    void deleteOpportunity(UUID id);

    VolunteerOpportunity getOpportunityById(UUID id);

    void applyForOpportunity(UUID id, String phoneNumber);

    List<VolunteerApplication> getApplicationsForOpportunity(UUID opportunityId);

    VolunteerApplication updateApplicationStatus(UUID applicationId, VolunteerApplication.Status status);

    List<VolunteerApplication> getMyApplications(String phoneNumber);
}
