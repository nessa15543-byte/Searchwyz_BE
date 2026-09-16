### SEARCHWYZ BACKEND API SERVER FOR DASHBOARD (USER AND ADMIN)
 This is an API server for SearchWyz (ADMIN AND users) Dashboard

## STACKS

## Main

1. Node
2. ExpressJS
3. MongoDB
4. ZOD

- Package Manager: `npm`


## GET STARTED

1. Clone the repo and install dependencies using `npm install`
2. Duplicate the `.env.example.show` and rename one of them to `.env` and use `dev` for the value of NODE_ENV
3. Update the `.env with the appropriate values.
4. Use `npm run dev` to run the server locally
5. **Always create a new branch** when working on a new task/feature you want to work on. Then **submit a pull request** when you're done with the task/feature. `<username>_<type>_<login-auth>` eg `learnuel_fix_auth`, `learnuel_feat_user-model` etc.
6. Follow the commit message convention bellow

## API DOCUMENTATION  


## Commit Message Pattern Convention

You're to follow this convention when creating a commit message

```bash
    type(scope?): message
```

Example

```bash
    feat(model): added account model
    fix: update the account model paths
``` 

### FRONTEND  

### Common types

- build
- chore
- ci
- docs
- feat
- fix
- perf
- refactor
- revert
- style
- test


Read more about it here [Commit Lint Doc](https://www.conventionalcommits.org/en/v1.0.0/) and here [Common Types Usage Text](https://commitlint.js.org/#/reference-prompt) to know more.

## FOLDER STRUCTURE
```

```

### SOFTWARE REQUIREMENTS SPECIFICATION (SRS)

## AI-Based Missing Person Search and Location Prioritization System

**Version:** 1.0  
**Document Type:** Software Requirements Specification  
**Project Type:** Undergraduate IT/SIWES Software Development Project

---

# 1. Introduction

## 1.1 Purpose

This Software Requirements Specification (SRS) defines the requirements for an **AI-Based Missing Person Search and Location Prioritization System**.

The proposed system is designed to assist in the reporting, management, and investigation of missing-person cases by providing a centralized platform where missing-person information, photographs, and reported sightings or clues can be collected.

The major distinguishing feature of the system is an **AI-based search-location prioritization component**. The AI model will analyze available clues and relevant location information and estimate which reported locations should receive higher search priority.

The system is intended to serve as a **decision-support tool** and will not claim to determine the exact real-time location of a missing person.

---

## 1.2 Problem Statement

Missing-person cases can become difficult to manage when information is scattered among family members, members of the public, social media platforms, and relevant authorities.

People who encounter a missing person or believe they have seen them may also provide information at different times and from different locations. Without a system for organizing these clues, it may be difficult to determine which information is more useful or which locations should be investigated first.

Existing missing-person platforms generally focus on reporting, searching, sharing information, and displaying last-known locations.

This project proposes an additional decision-support capability that analyzes available clues and ranks probable search locations according to their estimated priority.

---

## 1.3 Objectives

The objectives of the system are to:

1. Provide a platform for registering and managing missing-person cases.
2. Allow authorized users to provide relevant information about missing persons.
3. Allow the public to view verified missing-person cases.
4. Allow members of the public to submit sightings or clues.
5. Store photographs and descriptive information about missing persons.
6. Record the location, date, and time associated with reported sightings.
7. Analyze available clues using an AI/model-based component.
8. Rank locations according to their estimated search priority.
9. Provide explanations for factors contributing to a location's priority.
10. Provide authorized users with a dashboard for managing cases and clues.
11. Protect sensitive information from unauthorized access.
12. Provide a system that can support, rather than replace, human investigation.

---

# 2. Scope of the System

## 2.1 In Scope

The system will provide the following major functions:

- User registration and login.
- Missing-person case creation.
- Uploading of a recent photograph.
- Storage of physical characteristics and identifying information.
- Recording of last-known location.
- Public viewing of verified cases.
- Submission of sightings/clues.
- Recording of sighting location and time.
- Management and verification of submitted information.
- Map-based display of relevant locations.
- AI-based analysis of available clues.
- Ranking of probable search locations.
- Search-priority visualization.
- Case status management.
- Administrative management.
- Basic privacy and access control.

## 2.2 Out of Scope

The initial version will not:

- Guarantee that a missing person will be found.
- Determine a person's exact real-time location without appropriate location evidence.
- Hack or track another person's phone.
- Access private CCTV systems without authorization.
- Secretly track individuals through their devices.
- Automatically identify every person in a photograph.
- Replace police, search-and-rescue teams, or professional investigators.
- Expose sensitive information such as private addresses or room numbers to the general public.

---

# 3. Intended Users

The system will have three primary categories of users.

## 3.1 Public User

A public user does not necessarily need to create an account.

A public user may:

- View verified missing-person cases.
- Search for missing persons.
- View publicly available photographs and descriptions.
- Submit a sighting or clue.
- Provide relevant location information.

## 3.2 Registered Reporter

A registered reporter may be a family member, authorized individual, organization, or other person permitted to submit a missing-person case.

The registered reporter may:

- Create an account.
- Submit a missing-person case.
- Upload a photograph.
- Provide information about the missing person.
- Provide the last-known location.
- View the status of their submitted case.
- Receive updates about the case.

## 3.3 Administrator/Investigator

The administrator or authorized investigator will have elevated privileges.

They may:

- Review submitted cases.
- Verify or reject cases.
- Review submitted clues.
- Manage inappropriate or false reports.
- Update case status.
- View AI-generated search-priority results.
- Manage users.
- Manage system information.

---

# 4. Functional Requirements

## FR-01: User Registration

The system shall allow a reporter to create an account using required information such as:

- Full name
- Email address or phone number
- Password
- User role where applicable

The system shall validate the information before creating the account.

## FR-02: User Authentication

The system shall allow registered users to:

- Log in.
- Log out.
- Access features according to their role.

Passwords shall not be stored as plain text.

## FR-03: Missing-Person Case Creation

The system shall allow an authorized registered reporter to create a missing-person case.

The case shall contain information such as:

- Full name
- Age
- Gender
- Height
- Physical description
- Clothing last seen wearing
- Photograph
- Last-known location
- Date last seen
- Time last seen
- Additional relevant information

## FR-04: Photograph Upload

The system shall allow an authorized reporter to upload a recent photograph of the missing person.

The photograph shall be associated with the relevant missing-person case.

The system shall apply appropriate restrictions to uploaded files, such as supported file types and reasonable file-size limits.

## FR-05: Case Verification

New cases shall initially have a status such as:

**Pending Verification**

An administrator or authorized investigator shall be able to:

- Approve a case.
- Reject a case.
- Request additional information.

Only appropriate/verified cases should be displayed as verified public cases.

## FR-06: Public Case Search

The system shall allow public users to search for verified missing-person cases using information such as:

- Name
- Age range
- Gender
- Location
- Case status

## FR-07: Case Details

The system shall display appropriate public information for a verified missing-person case, including:

- Photograph
- Name
- Age
- Physical description
- Clothing description
- Last-known location
- Date/time last seen
- Relevant instructions for submitting information

Sensitive information shall not be unnecessarily exposed.

## FR-08: Sighting/Clue Submission

The system shall allow users to submit information about a possible sighting.

A clue may include:

- Description of what was observed.
- Location.
- Date.
- Time.
- Description of the person observed.
- Clothing observed.
- Direction of movement, where known.
- Additional comments.
- Optional supporting evidence where appropriate.

## FR-09: Clue Verification

Submitted clues shall be stored with an appropriate status, such as:

- Pending
- Verified
- Rejected
- Requires Review

Authorized users shall be able to review clues before they are used as reliable evidence by the AI component.

---

# 5. AI-Based Search Location Prioritization

## FR-10: Evidence Analysis

The system shall analyze available verified or appropriately weighted clues associated with a missing-person case.

Possible factors may include:

- Distance from the last-known location.
- Time of reported sighting.
- Recency of the sighting.
- Number of similar reports.
- Description similarity.
- Report reliability.
- Direction of reported movement.
- Relationship between reported locations.

## FR-11: Search Priority Estimation

The AI/model component shall generate an estimated priority for candidate locations.

For example:

| Candidate Location | Estimated Priority |
|---|---|
| Location A | High |
| Location B | Medium |
| Location C | Low |

The result shall be interpreted as a **search priority**, not proof that the missing person is present at the location.

## FR-12: Explainable Results

The system should provide an explanation of why a location received a particular priority.

For example:

### High Search Priority

**Possible contributing factors:**

- Two recent sightings were reported nearby.
- The reported time is consistent with the movement timeline.
- The description provided by the witnesses is consistent with the missing-person profile.
- The location is relatively close to another relevant sighting.

This feature will make the AI result easier for users and evaluators to understand.

## FR-13: Ranked Locations

The system shall arrange candidate locations from highest to lowest search priority.

The interface may display:

1. **Location A — High Priority**
2. **Location B — Medium Priority**
3. **Location C — Low Priority**

Where appropriate, these locations may also be displayed on a map.

---

# 6. Map and Location Requirements

## FR-14: Location Recording

The system shall allow locations associated with:

- Last-known sightings.
- Reported sightings.
- Other relevant evidence.

to be recorded.

## FR-15: Map Visualization

The system should display relevant locations on an interactive map.

Different markers may represent:

- Last-known location.
- Reported sightings.
- High-priority locations.
- Medium-priority locations.
- Low-priority locations.

---

# 7. Case Management

## FR-16: Case Status

An authorized administrator shall be able to update the status of a case.

Possible statuses include:

- Pending Verification
- Active
- Under Investigation
- Person Found
- Closed
- Rejected

## FR-17: Case Updates

Authorized users shall be able to update case information when new verified information becomes available.

## FR-18: Mark Person as Found

An authorized user shall be able to mark a missing-person case as resolved when the person has been found or the case has otherwise been officially closed.

---

# 8. Administrator Requirements

## FR-19: Administrator Dashboard

The administrator dashboard shall provide access to:

- Total cases.
- Pending cases.
- Active cases.
- Resolved cases.
- Pending clues.
- Verified clues.
- Search-priority results.

## FR-20: User Management

The administrator shall be able to:

- View registered users.
- Manage user accounts.
- Restrict inappropriate accounts where necessary.

## FR-21: Content Moderation

The administrator shall be able to review and remove inappropriate, fraudulent, or irrelevant information.

---

# 9. Non-Functional Requirements

## NFR-01: Security

The system shall:

- Authenticate registered users.
- Restrict administrative functionality.
- Protect passwords using secure hashing.
- Prevent unauthorized access to restricted information.
- Validate user input.

## NFR-02: Privacy

The system shall collect only information necessary for the operation of the system.

Sensitive information shall not be publicly exposed unnecessarily.

The system shall not provide unrestricted access to a person's private or real-time location.

## NFR-03: Usability

The interface should be simple enough for users with basic computer and smartphone knowledge.

Important functions should be clearly labelled.

## NFR-04: Performance

The system should respond to normal user requests within a reasonable period under the expected prototype workload.

AI analysis should not unnecessarily prevent users from accessing basic case information.

## NFR-05: Reliability

The system should maintain accurate records and prevent accidental loss or corruption of case and clue information.

## NFR-06: Maintainability

The system should be developed using a modular structure so that individual components can be modified without rewriting the entire application.

## NFR-07: Scalability

The architecture should allow additional cases, users, clues, and locations to be added without fundamental redesign.

---

# 10. Proposed System Architecture

The proposed system can be divided into the following major components:

## Frontend

Responsible for:

- Registration/login interface.
- Missing-person forms.
- Case search.
- Case details.
- Clue submission.
- Map display.
- User dashboards.

### Possible Technologies

- HTML
- CSS
- JavaScript

## Backend

Responsible for:

- Authentication.
- User management.
- Case management.
- Clue management.
- Database communication.
- Access control.
- Communication with the AI component.

### Possible Technologies

- Node.js
- Express.js

## Database

Responsible for storing:

- User records.
- Missing-person records.
- Photograph references.
- Cases.
- Sightings.
- Locations.
- AI results.
- Case statuses.

A suitable database may include **MongoDB**.

## AI/Analysis Component

Responsible for:

- Receiving relevant evidence/features.
- Processing the available information.
- Estimating location/search priority.
- Returning ranked candidate locations.

---

# 11. Proposed Data Requirements

## 11.1 User Data

Possible fields:

- User ID
- Full name
- Email/phone
- Password hash
- Role
- Account status
- Date created

## 11.2 Missing Person Data

Possible fields:

- Missing Person ID
- Full name
- Age
- Gender
- Height
- Physical description
- Clothing
- Photograph reference
- Last-known location
- Date last seen
- Time last seen
- Case status
- Reporter ID

## 11.3 Sighting/Clue Data

Possible fields:

- Clue ID
- Case ID
- Reporter/user ID where applicable
- Description
- Location
- Date
- Time
- Direction of movement
- Supporting information
- Verification status
- Reliability/weight
- Date submitted

## 11.4 AI Result Data

Possible fields:

- Result ID
- Case ID
- Candidate location
- Priority score
- Priority category
- Contributing factors
- Date generated

---

# 12. Basic System Workflow

The expected workflow is:

**Reporter registers**

↓

**Reporter creates missing-person case**

↓

**Photograph and identifying information are uploaded**

↓

**Case is submitted for verification**

↓

**Administrator reviews case**

↓

**Verified case becomes publicly searchable**

↓

**Members of the public submit sightings/clues**

↓

**Clues are reviewed/weighted**

↓

**Relevant evidence is provided to the AI component**

↓

**AI estimates search priorities**

↓

**Candidate locations are ranked**

↓

**Authorized users view the search-priority results**

↓

**Case is updated as new information becomes available**

↓

**Person is found / case is closed**

---

# 13. AI Model Requirements

The AI component is expected to be a relatively simple and explainable model suitable for a prototype.

Possible models may include:

- Decision Tree
- Logistic Regression
- Random Forest

The final model will be selected after examining the available data and determining which approach produces useful and interpretable results.

The AI model should not be presented as an infallible locator.

Its purpose is to answer:

> **"Given the evidence currently available, which candidate locations should receive greater search priority?"**

rather than:

> **"Where is the person definitely located?"**

---

# 14. Data Requirements and Limitations

A major requirement of the AI component is suitable training/testing data.

If sufficient real-world, ethically usable Nigerian missing-person data with location outcomes is unavailable, the prototype may use:

- Publicly available appropriately licensed/anonymized datasets.
- Simulated cases.
- Synthetic test data.
- Carefully constructed test scenarios.

Synthetic data must be clearly identified as synthetic and must not be presented as real missing-person cases.

The project shall acknowledge that model performance depends heavily on the quality, quantity, and reliability of available evidence.

---

# 15. Security and Ethical Considerations

Because missing-person information can involve vulnerable individuals, the system shall prioritize privacy and responsible access.

The system should:

1. Avoid exposing unnecessary personal information.
2. Avoid exposing private addresses.
3. Avoid displaying hotel room numbers or similarly sensitive details.
4. Restrict sensitive investigative information to authorized users.
5. Prevent the system from becoming an unrestricted people-tracking tool.
6. Clearly communicate that AI results are estimates.
7. Provide mechanisms for reviewing false or misleading reports.
8. Avoid treating an unverified sighting as established fact.

---

# 16. System Constraints

The project is a prototype and therefore may have limitations including:

- Limited training data.
- Limited computing resources.
- Limited access to real-time location information.
- Limited integration with official law-enforcement systems.
- Dependence on user-submitted information.
- Potentially inaccurate or fraudulent sightings.
- Limited geographical coverage during testing.

---

# 17. Success Criteria

The project will be considered successful if the prototype can demonstrate that:

1. A user can register and log in.
2. An authorized reporter can create a missing-person case.
3. A photograph can be associated with the case.
4. A verified case can be displayed publicly.
5. A user can submit a sighting/clue.
6. An administrator can review submitted information.
7. Relevant locations can be displayed.
8. The AI component can process selected evidence.
9. Candidate locations can be ranked according to search priority.
10. The system can provide understandable reasons for the ranking.
11. Unauthorized users cannot access restricted information.
12. The complete workflow can be demonstrated during project defence.

---

# 18. Future Enhancements

Future versions of the system could potentially include:

- Advanced computer-vision-assisted identification.
- Integration with authorized CCTV systems.
- Integration with official missing-person databases.
- Mobile application support.
- SMS notifications.
- Emergency alerts.
- Improved geospatial modelling.
- More sophisticated machine-learning models.
- Multilingual support.
- Improved witness/reporter credibility mechanisms.
- Voluntary "I am safe" confirmation functionality.

These features are considered **future enhancements** and are not required for the first prototype.

---

# 19. Project Differentiating Feature

The major differentiating feature of the proposed system is:

**AI-based evidence analysis and search-location prioritization.**

Rather than functioning only as a missing-person database, the proposed system attempts to organize available sightings and other relevant evidence and use them to determine which candidate locations should receive greater search attention.

The system therefore combines:

**Missing-person identification + photograph + evidence collection + geospatial information + AI-assisted search prioritization.**

---

# 20. Summary

The proposed **AI-Based Missing Person Search and Location Prioritization System** is a decision-support platform intended to improve the organization and analysis of information relating to missing-person cases.

The system will allow authorized reporters to create cases containing photographs and identifying information, while members of the public can provide potential sightings or clues.

The key innovation of the prototype is an AI-based component that analyzes available evidence and produces a ranked list of probable search locations.

The system will not claim to know a missing person's exact location. Instead, it will provide an evidence-based indication of **where search efforts may be prioritized**, while leaving final investigation and decision-making to authorized human responders.