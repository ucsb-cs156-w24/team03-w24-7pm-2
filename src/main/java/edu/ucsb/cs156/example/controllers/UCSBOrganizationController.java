package edu.ucsb.cs156.example.controllers;

import edu.ucsb.cs156.example.entities.UCSBOrganization;
import edu.ucsb.cs156.example.errors.EntityNotFoundException;
import edu.ucsb.cs156.example.repositories.UCSBOrganizationRepository;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

@Tag(name = "UCSBOrganization")
@RequestMapping("/api/ucsborganization")
@RestController
@Slf4j
public class UCSBOrganizationController extends ApiController {

    @Autowired
    UCSBOrganizationRepository ucsbOrganizationRepository;

    @Operation(summary= "List all ucsb organizations")
    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("/all")
    public Iterable<UCSBOrganization> allCommonss() {
        Iterable<UCSBOrganization> commons = ucsbOrganizationRepository.findAll();
        return commons;
    }

    @Operation(summary= "Get a single organization")
    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("")
    public UCSBOrganization getById(
            @Parameter(name="code") @RequestParam String code) {
        UCSBOrganization commons = ucsbOrganizationRepository.findById(code)
                .orElseThrow(() -> new EntityNotFoundException(UCSBOrganization.class, code));

        return commons;
    }

    @Operation(summary= "Create a new commons")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/post")
    public UCSBOrganization postCommons(
        @Parameter(name="orgCode") @RequestParam String orgCode,
        @Parameter(name="orgTranslationShort") @RequestParam String orgTranslationShort,
        @Parameter(name="orgTranslation") @RequestParam String orgTranslation,
        @Parameter(name="inactive") @RequestParam boolean inactive
        )
        {

        UCSBOrganization commons = new UCSBOrganization();
        commons.setOrgCode(orgCode);
        commons.setOrgTranslationShort(orgTranslationShort);
        commons.setOrgTranslation(orgTranslation);
        commons.setInactive(inactive);

        UCSBOrganization savedCommons = ucsbOrganizationRepository.save(commons);

        return savedCommons;
    }

    @Operation(summary= "Update a single organization")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping("")
    public UCSBOrganization updateOrganizations(
            @Parameter(name="code") @RequestParam String code,
            @RequestBody @Valid UCSBOrganization incoming) {

        UCSBOrganization organizations = ucsbOrganizationRepository.findById(code)
                .orElseThrow(() -> new EntityNotFoundException(UCSBOrganization.class, code));


        organizations.setOrgCode(incoming.getOrgCode());  
        organizations.setOrgTranslationShort(incoming.getOrgTranslationShort());  
        organizations.setOrgTranslation(incoming.getOrgTranslation());
        organizations.setInactive(incoming.getInactive());

        ucsbOrganizationRepository.save(organizations);

        return organizations;
    }

    @Operation(summary= "Delete a UCSBOrganization")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("")
    public Object deleteOrganizations(
            @Parameter(name="orgCode") @RequestParam String orgCode) {
        UCSBOrganization organizations = ucsbOrganizationRepository.findById(orgCode)
                .orElseThrow(() -> new EntityNotFoundException(UCSBOrganization.class, orgCode));

        ucsbOrganizationRepository.delete(organizations);
        return genericMessage("UCSBOrganization with id %s deleted".formatted(orgCode));
    }
}