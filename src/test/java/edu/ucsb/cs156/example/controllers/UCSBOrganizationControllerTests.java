package edu.ucsb.cs156.example.controllers;

import edu.ucsb.cs156.example.repositories.UserRepository;
import edu.ucsb.cs156.example.testconfig.TestConfig;
import edu.ucsb.cs156.example.ControllerTestCase;
import edu.ucsb.cs156.example.entities.UCSBOrganization;
import edu.ucsb.cs156.example.repositories.UCSBOrganizationRepository;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@WebMvcTest(controllers = UCSBOrganizationController.class)
@Import(TestConfig.class)
public class UCSBOrganizationControllerTests extends ControllerTestCase {

    @MockBean
    UCSBOrganizationRepository ucsbOrganizationRepository;

    @MockBean
    UserRepository userRepository;

    // Tests for GET /api/ucsborganization/all
    @Test
    public void logged_out_users_cannot_get_all() throws Exception {
        mockMvc.perform(get("/api/ucsborganization/all"))
                .andExpect(status().is(403)); // logged out users can't get all
    }

    @WithMockUser(roles = { "USER" })
    @Test
    public void logged_in_users_can_get_all() throws Exception {
        mockMvc.perform(get("/api/ucsborganization/all"))
                .andExpect(status().is(200)); // logged
    }

    @WithMockUser(roles = { "USER" })
    @Test
    public void test_that_logged_in_user_can_get_by_id_when_the_id_does_not_exist() throws Exception {

        // arrange

        when(ucsbOrganizationRepository.findById(eq("SENTINELS"))).thenReturn(Optional.empty());

        // act
        MvcResult response = mockMvc.perform(get("/api/ucsborganization?code=SENTINELS"))
                .andExpect(status().isNotFound()).andReturn();

        // assert

        verify(ucsbOrganizationRepository, times(1)).findById(eq("SENTINELS"));
        Map<String, Object> json = responseToJson(response);
        assertEquals("EntityNotFoundException", json.get("type"));
        assertEquals("UCSBOrganization with id SENTINELS not found", json.get("message"));
    }

    @WithMockUser(roles = { "USER" })
    @Test
    public void logged_in_user_can_get_all_ucsborganization() throws Exception {

        // arrange
        UCSBOrganization zetaphirho = UCSBOrganization.builder()
                .orgCode("ZPR")
                .orgTranslationShort("ZETA PHI RHO")
                .orgTranslation("ZETA PHI RHO")
                .inactive(false)
                .build();

        UCSBOrganization skydiving = UCSBOrganization.builder()
                .orgCode("SKY")
                .orgTranslationShort("SKYDIVING CLUB")
                .orgTranslation("SKYDIVING CLUB AT UCSB")
                .inactive(false)
                .build();

        UCSBOrganization office_of_student_life = UCSBOrganization.builder()
                .orgCode("OSLI")
                .orgTranslationShort("STUDENT LIFE")
                .orgTranslation("OFFICE OF STUDENT LIFE")
                .inactive(false)
                .build();

        UCSBOrganization korean_radio_club = UCSBOrganization.builder()
                .orgCode("KRC")
                .orgTranslationShort("KOREAN RADIO CL")
                .orgTranslation("KOREAN RADIO CLUB")
                .inactive(false)
                .build();

        ArrayList<UCSBOrganization> expectedCommons = new ArrayList<>();
        expectedCommons.addAll(Arrays.asList(zetaphirho, skydiving, office_of_student_life, korean_radio_club));

        when(ucsbOrganizationRepository.findAll()).thenReturn(expectedCommons);

        // act
        MvcResult response = mockMvc.perform(get("/api/ucsborganization/all"))
                .andExpect(status().isOk()).andReturn();

        // assert

        verify(ucsbOrganizationRepository, times(1)).findAll();
        String expectedJson = mapper.writeValueAsString(expectedCommons);
        String responseString = response.getResponse().getContentAsString();
        assertEquals(expectedJson, responseString);
    }

    // Tests for GET /api/ucsborganization?...

        @Test
        public void logged_out_users_cannot_get_by_id() throws Exception {
        mockMvc.perform(get("/api/ucsborganization?code=SKY"))
                .andExpect(status().is(403)); // logged out users can't get by id
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void test_that_logged_in_user_can_get_by_id_when_the_id_exists() throws Exception {

        // arrange

        UCSBOrganization OSLI = UCSBOrganization.builder()
                .orgCode("OSLI")
                .orgTranslationShort("STUDENT LIFE")
                .orgTranslation("OFFICE OF STUDENT LIFE")
                .inactive(false)
                .build();

        when(ucsbOrganizationRepository.findById(eq("OSLI"))).thenReturn(Optional.of(OSLI));
        // act
        MvcResult response = mockMvc.perform(get("/api/ucsborganization?code=OSLI"))
                .andExpect(status().isOk()).andReturn();
        // assert
        verify(ucsbOrganizationRepository, times(1)).findById(eq("OSLI"));
        String expectedJson = mapper.writeValueAsString(OSLI);
        String responseString = response.getResponse().getContentAsString();
        assertEquals(expectedJson, responseString);
        }

    // Tests for POST /api/ucsborganization...

    @Test
    public void logged_out_users_cannot_post() throws Exception {
        mockMvc.perform(post("/api/ucsborganization/post"))
                .andExpect(status().is(403));
    }

    @WithMockUser(roles = { "USER" })
    @Test
    public void logged_in_regular_users_cannot_post() throws Exception {
        mockMvc.perform(post("/api/ucsborganization/post"))
                .andExpect(status().is(403)); // only admins can post
    }

    @WithMockUser(roles = { "ADMIN", "USER" })
    @Test
    public void an_admin_user_can_post_a_new_commons() throws Exception {
        // arrange

        UCSBOrganization osli = UCSBOrganization.builder()
                .orgCode("OSLI")
                .orgTranslationShort("STUDENT LIFE")
                .orgTranslation("OFFICE OF STUDENT LIFE")
                .inactive(false)
                .build();

        when(ucsbOrganizationRepository.save(eq(osli))).thenReturn(osli);

        // act
        MvcResult response = mockMvc.perform(
                post("/api/ucsborganization/post?name=OSLI&orgCode=OSLI&orgTranslationShort=STUDENT LIFE&orgTranslation=OFFICE OF STUDENT LIFE&inactive=false")
                        .with(csrf()))
                .andExpect(status().isOk()).andReturn();

        // assert
        verify(ucsbOrganizationRepository, times(1)).save(osli);
        String expectedJson = mapper.writeValueAsString(osli);
        String responseString = response.getResponse().getContentAsString();
        assertEquals(expectedJson, responseString);
    }

    @WithMockUser(roles = { "ADMIN", "USER" })
    @Test
    public void an_admin_user_can_post_a_new_inactive_commons() throws Exception {
    // arrange
        UCSBOrganization inactiveOrg = UCSBOrganization.builder()
                .orgCode("C9")
                .orgTranslationShort("C9")
                .orgTranslation("CLOUD9")
                .inactive(true)
                .build();

        when(ucsbOrganizationRepository.save(eq(inactiveOrg))).thenReturn(inactiveOrg);

        // act
        MvcResult response = mockMvc.perform(
                post("/api/ucsborganization/post?orgCode=C9&orgTranslationShort=C9&orgTranslation=CLOUD9&inactive=true")
                        .with(csrf()))
                .andExpect(status().isOk()).andReturn();

        // assert
        verify(ucsbOrganizationRepository, times(1)).save(inactiveOrg);
        String expectedJson = mapper.writeValueAsString(inactiveOrg);
        String responseString = response.getResponse().getContentAsString();
        assertEquals(expectedJson, responseString);
        }

    // Tests for PUT /api/ucsborganization?...

    @WithMockUser(roles = { "ADMIN", "USER" })
    @Test
    public void admin_can_edit_an_existing_commons() throws Exception {
        // arrange

        UCSBOrganization zprOrig = UCSBOrganization.builder()
                .orgCode("ZPR")
                .orgTranslationShort("ZETA PHI RHO")
                .orgTranslation("ZETA PHI RHO")
                .inactive(false)
                .build();

        UCSBOrganization zprEdited = UCSBOrganization.builder()
                .orgCode("ZPRF")
                .orgTranslationShort("ZETA PHI RHO FRAT")
                .orgTranslation("ZETA PHI RHO FRATERNITY")
                .inactive(true)
                .build();

        String requestBody = mapper.writeValueAsString(zprEdited);

        when(ucsbOrganizationRepository.findById(eq("ZPR"))).thenReturn(Optional.of(zprOrig));

        // act
        MvcResult response = mockMvc.perform(
                put("/api/ucsborganization?code=ZPR")
                        .contentType(MediaType.APPLICATION_JSON)
                        .characterEncoding("utf-8")
                        .content(requestBody)
                        .with(csrf()))
                .andExpect(status().isOk()).andReturn();

        // assert
        verify(ucsbOrganizationRepository, times(1)).findById("ZPR");
        verify(ucsbOrganizationRepository, times(1)).save(zprEdited); // should be saved with updated info
        String responseString = response.getResponse().getContentAsString();
        assertEquals(requestBody, responseString);
    }

    @WithMockUser(roles = { "ADMIN", "USER" })
    @Test
    public void admin_cannot_edit_organizations_that_does_not_exist() throws Exception {
        // arrange

        UCSBOrganization c9Edited = UCSBOrganization.builder()
                .orgCode("C9")
                .orgTranslationShort("C9")
                .orgTranslation("CLOUD9")
                .inactive(true)
                .build();


        String requestBody = mapper.writeValueAsString(c9Edited);

        when(ucsbOrganizationRepository.findById(eq("C9"))).thenReturn(Optional.empty());

        // act
        MvcResult response = mockMvc.perform(
                put("/api/ucsborganization?code=C9")
                        .contentType(MediaType.APPLICATION_JSON)
                        .characterEncoding("utf-8")
                        .content(requestBody)
                        .with(csrf()))
                .andExpect(status().isNotFound()).andReturn();

        // assert
        verify(ucsbOrganizationRepository, times(1)).findById("C9");
        Map<String, Object> json = responseToJson(response);
        assertEquals("UCSBOrganization with id C9 not found", json.get("message"));

    }

    // Tests for DELETE /api/ucsborganization?...

    @WithMockUser(roles = { "ADMIN", "USER" })
    @Test
    public void admin_can_delete_a_date() throws Exception {
            // arrange

            UCSBOrganization SKY = UCSBOrganization.builder()
                            .orgCode("SKY")
                            .orgTranslationShort("SKYDIVING CLUB")
                            .orgTranslation("SKYDIVING CLUB AT UCSB")
                            .inactive(true)
                            .build();

            when(ucsbOrganizationRepository.findById(eq("SKY"))).thenReturn(Optional.of(SKY));

            // act
            MvcResult response = mockMvc.perform(
                            delete("/api/ucsborganization?code=SKY")
                                            .with(csrf()))
                            .andExpect(status().isOk()).andReturn();

            // assert
            verify(ucsbOrganizationRepository, times(1)).findById("SKY");
            verify(ucsbOrganizationRepository, times(1)).delete(any());

            Map<String, Object> json = responseToJson(response);
            assertEquals("UCSBOrganization with id SKY deleted", json.get("message"));
    }

    @WithMockUser(roles = { "ADMIN", "USER" })
    @Test
    public void admin_tries_to_delete_non_existant_organization_and_gets_right_error_message()
                    throws Exception {
            // arrange

            when(ucsbOrganizationRepository.findById(eq("SKULLPANDA"))).thenReturn(Optional.empty());

            // act
            MvcResult response = mockMvc.perform(
                            delete("/api/ucsborganization?code=SKULLPANDA")
                                            .with(csrf()))
                            .andExpect(status().isNotFound()).andReturn();

            // assert
            verify(ucsbOrganizationRepository, times(1)).findById("SKULLPANDA");
            Map<String, Object> json = responseToJson(response);
            assertEquals("UCSBOrganization with id SKULLPANDA not found", json.get("message"));
    }


}