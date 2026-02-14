package com.seva.service;

import com.seva.entity.Branch;
import com.seva.repository.BranchRepository;
import com.seva.repository.search.BranchSearchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BranchService {

    private final BranchRepository branchRepository;
    private final BranchSearchRepository branchSearchRepository;

    public List<Branch> getAllBranches() {
        return branchRepository.findAll();
    }

    public Branch saveBranch(Branch branch) {
        Branch saved = branchRepository.save(branch);
        branchSearchRepository.save(saved);
        return saved;
    }

    public void deleteBranch(java.util.UUID id) {
        branchRepository.deleteById(id);
        branchSearchRepository.deleteById(id);
    }
}
