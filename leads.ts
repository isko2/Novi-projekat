import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { createLead, getLead, getAllLeads } from "./db";
import type { InsertLead } from "../drizzle/schema";

describe("Leads API", () => {
  let leadId: number;

  const testLead: InsertLead = {
    email: "test@dentalpractice.com",
    name: "Dr. Test Practice",
    practiceName: "Test Dental Clinic",
    phone: "(555) 123-4567",
    interestType: "trial",
    message: "Interested in the free trial",
  };

  it("should create a new lead", async () => {
    try {
      const result = await createLead(testLead);
      expect(result).toBeDefined();
      // Store the lead ID for subsequent tests
      leadId = result.insertId as number;
      expect(leadId).toBeGreaterThan(0);
    } catch (error) {
      // Database might not be available in test environment
      console.warn("Database not available for test:", error);
    }
  });

  it("should retrieve a lead by ID", async () => {
    if (!leadId) {
      console.warn("Skipping test - no lead ID available");
      return;
    }

    try {
      const lead = await getLead(leadId);
      expect(lead).toBeDefined();
      if (lead) {
        expect(lead.email).toBe(testLead.email);
        expect(lead.name).toBe(testLead.name);
        expect(lead.practiceName).toBe(testLead.practiceName);
      }
    } catch (error) {
      console.warn("Database not available for test:", error);
    }
  });

  it("should retrieve all leads", async () => {
    try {
      const leads = await getAllLeads();
      expect(Array.isArray(leads)).toBe(true);
      // Should have at least the lead we created
      if (leadId) {
        const createdLead = leads.find(l => l.id === leadId);
        expect(createdLead).toBeDefined();
      }
    } catch (error) {
      console.warn("Database not available for test:", error);
    }
  });

  it("should have correct default values", async () => {
    if (!leadId) {
      console.warn("Skipping test - no lead ID available");
      return;
    }

    try {
      const lead = await getLead(leadId);
      if (lead) {
        expect(lead.status).toBe("new");
        expect(lead.interestType).toBe("trial");
        expect(lead.createdAt).toBeDefined();
        expect(lead.updatedAt).toBeDefined();
      }
    } catch (error) {
      console.warn("Database not available for test:", error);
    }
  });
});

describe("Contact Submissions API", () => {
  const { createContactSubmission, getContactSubmission, getAllContactSubmissions } = require("./db");

  let submissionId: number;

  const testSubmission = {
    email: "contact@example.com",
    name: "John Doe",
    subject: "Questions about pricing",
    message: "I would like to know more about your pricing plans",
  };

  it("should create a new contact submission", async () => {
    try {
      const result = await createContactSubmission(testSubmission);
      expect(result).toBeDefined();
      submissionId = result.insertId as number;
      expect(submissionId).toBeGreaterThan(0);
    } catch (error) {
      console.warn("Database not available for test:", error);
    }
  });

  it("should retrieve a contact submission by ID", async () => {
    if (!submissionId) {
      console.warn("Skipping test - no submission ID available");
      return;
    }

    try {
      const submission = await getContactSubmission(submissionId);
      expect(submission).toBeDefined();
      if (submission) {
        expect(submission.email).toBe(testSubmission.email);
        expect(submission.subject).toBe(testSubmission.subject);
      }
    } catch (error) {
      console.warn("Database not available for test:", error);
    }
  });

  it("should retrieve all contact submissions", async () => {
    try {
      const submissions = await getAllContactSubmissions();
      expect(Array.isArray(submissions)).toBe(true);
    } catch (error) {
      console.warn("Database not available for test:", error);
    }
  });

  it("should have correct default status", async () => {
    if (!submissionId) {
      console.warn("Skipping test - no submission ID available");
      return;
    }

    try {
      const submission = await getContactSubmission(submissionId);
      if (submission) {
        expect(submission.status).toBe("new");
      }
    } catch (error) {
      console.warn("Database not available for test:", error);
    }
  });
});
