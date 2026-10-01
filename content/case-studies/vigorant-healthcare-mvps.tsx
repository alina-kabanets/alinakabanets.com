import {
  CaseSection,
  DataTable,
  Figure,
  FigureGrid,
  Prose,
  Quote,
  Stats,
  Subheading,
  TeamMap,
} from "@/components/case-study";
import beforeDash1 from "@/public/images/work/borna/study/before-dash-1.jpg";
import beforeDash2 from "@/public/images/work/borna/study/before-dash-2.jpg";
import desk from "@/public/images/work/borna/study/desk.jpg";
import exploreDash from "@/public/images/work/borna/study/explore-dash.jpg";
import exploreForm from "@/public/images/work/borna/study/explore-form.jpg";
import exploreHub from "@/public/images/work/borna/study/explore-hub.jpg";
import finalAdminDashboard from "@/public/images/work/borna/study/final-admin-dashboard.jpg";
import finalAppointment from "@/public/images/work/borna/study/final-appointment.jpg";
import finalAvailability from "@/public/images/work/borna/study/final-availability.jpg";
import finalBilling from "@/public/images/work/borna/study/final-billing.jpg";
import finalDependents from "@/public/images/work/borna/study/final-dependents.jpg";
import finalForm from "@/public/images/work/borna/study/final-form.jpg";
import finalPatientDashboard from "@/public/images/work/borna/study/final-patient-dashboard.jpg";
import finalPaymentRequest from "@/public/images/work/borna/study/final-payment-request.jpg";
import flowPatient from "@/public/images/work/borna/study/flow-patient.jpg";
import flowPatientDetail from "@/public/images/work/borna/study/flow-patient-detail.jpg";
import paletteEarly from "@/public/images/work/borna/study/palette-early.jpg";
import paletteFinal from "@/public/images/work/borna/study/palette-final.jpg";
import sketchBooking from "@/public/images/work/borna/study/sketch-booking.jpg";
import sketchHistory from "@/public/images/work/borna/study/sketch-history.jpg";
import sketchHome from "@/public/images/work/borna/study/sketch-home.jpg";
import sketchSteps from "@/public/images/work/borna/study/sketch-steps.jpg";

export default function VigorantCaseStudy() {
  return (
    <>
      <CaseSection label="Team" title="A small team building a new product from zero.">
        <TeamMap
          members={[
            { role: "Me", note: "Lead product designer, front-end contributor", me: true },
            { role: "Founder", note: "Product direction, clients" },
            { role: "Product manager", note: "Roadmap, requirements" },
            { role: "Back-end / DevOps developer", note: "APIs, infrastructure" },
            { role: "Front-end developer", note: "Web app build" },
            { role: "Supporting designer", note: "Onboarded and mentored by me" },
          ]}
        />
      </CaseSection>

      <CaseSection label="Context" title="An agency building its own product.">
        <Prose>
          <p>
            Vigorant is a healthcare marketing agency working with dental clinics. In 2025 it set up a small in-house
            team to build its own SaaS product, <strong>Borna Care</strong>, as a new revenue stream: software that
            takes a clinic’s patient admin off the phone and off paper.
          </p>
          <p>
            I joined to design marketing websites. A month later I moved to the product team full-time, as its only
            product designer.
          </p>
        </Prose>
        <Subheading>The problem</Subheading>
        <Prose>
          <p>
            Patients book by phone during office hours, fill in the same paper forms at every visit and chase
            invoices. Clinic staff re-type all of it.
          </p>
          <p>
            <strong>What we had to achieve:</strong> two connected products, one for patients and one for clinic
            staff, designed from zero, ready for real clinics within months, and built as the foundation for a
            five-product platform.
          </p>
        </Prose>
        <FigureGrid
          images={[
            { src: beforeDash1, alt: "Dash Vigorant analytics dashboard with traffic charts, before the redesign" },
            { src: beforeDash2, alt: "Dash Vigorant leads and business metrics charts, before the redesign" },
          ]}
          caption="The starting point: Dash Vigorant, the agency’s analytics dashboard, with its own visual language. The new products needed a system that could hold five products, not one."
        />
      </CaseSection>

      <CaseSection label="01 · Discover" title="Learning a new domain, fast.">
        <Prose>
          <ul>
            <li>Learned the dental and healthcare domain from scratch, including what HIPAA means for UI.</li>
            <li>
              Reviewed more than 10 patient-portal and practice-management products: what patients expect, and where clinic
              workflows break.
            </li>
            <li>
              Mapped the recurring pains: <strong>repetitive paperwork, scheduling by phone, confusing billing</strong>{" "}
              and <strong>managing family members’ care</strong>.
            </li>
          </ul>
        </Prose>
        <Figure
          image={{ src: desk, alt: "Desk covered in research notes, needs and pains grids, and paper sketches" }}
          caption="Research notes turned straight into sketches. The question on every page: how can we make this as few steps as possible?"
        />
      </CaseSection>

      <CaseSection label="02 · Define" title="Every journey, for every role, before any screen.">
        <Prose>
          <p>
            I mapped the full product for <strong>patients, clinic admins and providers</strong>: every action,
            decision and edge case, with open questions pinned next to the step they affected.
          </p>
        </Prose>
        <Figure
          wide
          image={{
            src: flowPatient,
            alt: "Complete patient user flow: sign-up and login, homepage, and ten branches from booking to educational content",
          }}
          caption="The patient journey, one of three role maps. It became the team’s shared map for scoping, estimating and building."
        />
        <Figure
          image={{
            src: flowPatientDetail,
            alt: "Detail of the patient flow: new-patient and forgotten-password decisions leading to the homepage",
          }}
          caption="Detail: entry into the portal. Decisions in blue, screens in yellow, open questions in grey."
        />
        <Subheading>The hard trade-off: cutting to an MVP</Subheading>
        <Prose>
          <p>
            The flows described the whole product. The MVP kept what a clinic needs on day one:{" "}
            <strong>appointments, forms, payments, family members and notifications</strong>. It deferred{" "}
            <strong>messaging and telehealth, treatment history and educational content</strong>.
          </p>
          <p>
            I rebuilt the information architecture and flows around that smaller scope, so the MVP felt complete
            rather than unfinished, with room for the deferred features to slot back in without a redesign.
          </p>
        </Prose>
      </CaseSection>

      <CaseSection label="03 · Develop" title="Exploring widely before narrowing.">
        <Prose>
          <p>
            On paper, exploration was cheap. I sketched several models for the patient home, from a “puzzle”
            dashboard and a bookshelf metaphor to an assistant asking “what do you need to do today?”, and six ways
            to show treatment history.
          </p>
        </Prose>
        <FigureGrid
          columns={4}
          images={[
            { src: sketchHome, alt: "Sketches of patient home layouts: cards, puzzle, bookshelf, tailored stats" },
            { src: sketchSteps, alt: "Sketches on minimising steps, and AI ideas: smart prioritising, voice panel" },
            { src: sketchBooking, alt: "Sketches of a unified booking calendar and notes on making it more human" },
            { src: sketchHistory, alt: "Sketches of six treatment history visualisations: timelines, steps, columns" },
          ]}
          caption="Four of the sketch pages. Treatment history was explored here, then deferred at the MVP cut."
        />
        <Subheading>Choosing the visual language</Subheading>
        <Prose>
          <p>
            I reviewed how competing products look and was given a free hand to choose the UI style for the new
            products and their design system. I chose a soft, neumorphic style, and the team approved it:
          </p>
          <ul>
            <li>
              <strong>Calm and human</strong>, which suits clinics and patients better than a dense, spreadsheet-like
              dashboard.
            </li>
            <li>
              <strong>Minimal and versatile</strong> enough to carry data-heavy admin screens as well as simple
              patient ones.
            </li>
          </ul>
          <p>
            Before designing, I checked with the developers how a UI that relies heavily on shadows would perform,
            so the style was a decision the build could afford.
          </p>
        </Prose>
        <FigureGrid
          columns={3}
          images={[
            { src: exploreHub, alt: "Early concept: a platform home listing apps, today’s snapshot and recommendations" },
            { src: exploreForm, alt: "Early concept: patient form with a step tracker and a My Self / My Child toggle" },
            { src: exploreDash, alt: "Early concept: Dash Vigorant paid advertising dashboard in the neumorphic style" },
          ]}
          caption="Early concepts in the new language: a home for the future five-product platform, the first patient form, and Dash redrawn. The style carried through to the shipped portals; these particular screens were explorations."
        />
        <Subheading>A design system for five products</Subheading>
        <Prose>
          <p>
            I built the system in Figma (colour, type, spacing, components and interaction patterns) and owned it as
            the product scaled to multi-clinic setups.
          </p>
        </Prose>
        <FigureGrid
          images={[
            { src: paletteEarly, alt: "Early palette: deep red, amber and three greens" },
            { src: paletteFinal, alt: "Final palette: deep red, amber, teal, pale teal and off-white" },
          ]}
          caption="Two palette directions. The second kept the brand’s red and amber as accents and moved the base to a calmer teal, better suited to a healthcare product."
        />
      </CaseSection>

      <CaseSection label="Key moments" title="Two decisions that saved the team time.">
        <Subheading>Super profiles: redesigning around the clinic</Subheading>
        <Prose>
          <p>
            The product grew fast: Forms, then the patient portal, then the admin portal, then{" "}
            <strong>multi-clinic</strong> support. My first super profile nested clinics inside the owner’s account.
            As clinics were added, admins needed to work <em>inside</em> a clinic rather than hunt for it. I
            redesigned the IA, menus and profiles so that <strong>entering a clinic</strong> became the first step.
          </p>
        </Prose>
        <Subheading>RBAC: one table instead of guesswork</Subheading>
        <Prose>
          <p>
            Role and permission requirements arrived as long lists per role, with overlaps and the same role under
            two different names. Rather than design screens on assumptions, I turned them into a{" "}
            <strong>comparison matrix of roles and permissions</strong> and resolved every open question with the
            founder and developers. Then I revisited every flow and annotated the handoff.
          </p>
        </Prose>
        <DataTable
          head={["Permission", "Account owner", "Admin", "User"]}
          rows={[
            ["Scope", "All companies", "Assigned companies", "Assigned branches"],
            ["Billing, subscription, purchases", "✓", "–", "–"],
            ["Create admins, assign the admin role", "✓", "–", "–"],
            ["Enable or disable apps and licences", "✓", "–", "–"],
            ["Invite and deactivate users", "✓", "✓", "–"],
            ["Assign roles and seats", "✓", "✓ from existing licences", "–"],
            ["Company, office and app settings", "✓", "✓", "–"],
            ["Forms, templates, EHR integrations", "✓", "✓", "View only"],
            ["Payment requests and history", "✓", "✓", "View only"],
            ["Appointments and daily operations", "✓", "✓", "✓"],
            ["Dashboards and reports", "✓", "✓", "✓ own branch"],
          ]}
          caption="A condensed version of the matrix. Seen side by side, the three roles differ in two things: how far they reach, and whether they can change money, people or settings."
        />
        <Prose>
          <p>Engineers implemented it without rework, which saved the team a couple of days.</p>
        </Prose>
      </CaseSection>

      <CaseSection label="04 · Deliver" title="Two portals, shipped in four months.">
        <Prose>
          <p>
            The patient and admin portal MVPs were ready in February, four months after I started on the product.
            Then we kept shipping features on top.
          </p>
        </Prose>
        <Figure
          wide
          image={{
            src: finalPatientDashboard,
            alt: "Patient portal home: upcoming appointment, forms, payments, dependents and notifications cards, with a calendar",
          }}
          caption="Patient home: everything a patient needs to do, one step away. The cards replaced the long menu from the first sketches."
        />
        <FigureGrid
          images={[
            { src: finalAppointment, alt: "Appointment detail with provider, time, location map and required forms" },
            { src: finalBilling, alt: "Patient billing: pending payment requests and recent transactions" },
          ]}
          caption="Appointment detail and billing: everything about a visit, and what’s owed, in one place."
        />
        <FigureGrid
          images={[
            { src: finalDependents, alt: "Dependents: managing appointments and profiles for family members" },
            { src: finalPaymentRequest, alt: "Admin: creating a payment request in four steps" },
          ]}
          caption="The family-care pain from research became dependents: one account, the whole family. On the clinic side, a payment request takes four steps."
        />
        <FigureGrid
          images={[
            { src: finalAvailability, alt: "Admin: weekly service availability slots per provider" },
            {
              src: finalAdminDashboard,
              alt: "Admin dashboard: services, forms overview, pending users, payments and today’s appointments",
            },
          ]}
          caption="The clinic side: provider availability, and the admin dashboard with today’s appointments. Confirmations go out by email and SMS automatically, so nobody has to phone the patient."
        />
        <Subheading>Forms: from exploration to first paying client</Subheading>
        <Prose>
          <p>
            Intake forms became a <strong>standalone product</strong>, Borna Forms. It was the first part of
            Borna to be sold, and it won the product’s <strong>first paying client</strong>. It is live in
            production today on a client clinic’s website.
          </p>
        </Prose>
        <FigureGrid
          images={[
            { src: exploreForm, alt: "First exploration of the patient intake form" },
            { src: finalForm, alt: "Shipped patient intake form with sections for demographics, dental and medical history" },
          ]}
          caption="From the first concept to the shipped form. The “My Self / My Child” toggle grew into the dependents feature."
        />
        <Subheading>Handoff and QA</Subheading>
        <Prose>
          <ul>
            <li>Annotated handoffs and component consistency reviews, working directly with both developers on feasibility.</li>
            <li>Fixed a few UI bugs in code myself.</li>
            <li>
              Tested the built product before launch and logged <strong>60+ bugs</strong> in Azure Boards.
            </li>
          </ul>
        </Prose>
      </CaseSection>

      <CaseSection label="Results" title="What shipped, and what changed for me.">
        <Stats
          items={[
            { value: "4 months", label: "From a blank Figma file to MVP UI for two products" },
            { value: "1st", label: "Paying client for Borna, won by the Forms product" },
            { value: "60+", label: "Bugs caught and documented before launch" },
          ]}
        />
        <Prose>
          <p>
            <strong>My role grew with the product.</strong> I was given lead product designer responsibilities
            because the team saw high potential. My work spread beyond design, into product decisions and a few
            front-end fixes in code. The founder started asking me product questions, like whether to sell features separately or as one package, which
            is how I started learning product management.
          </p>
        </Prose>
        <Quote name="Hamid Baher" role="Founder & CEO, Vigorant">
          “The progress we made on both MVPs in such a short time speaks a lot about your dedication and ability to
          take ownership in complex environments. I truly appreciate the effort, creativity, and initiative you
          brought to the table - not just in design, but in thinking through product challenges and supporting the
          team.”
        </Quote>
      </CaseSection>

      <CaseSection label="Reflection" title="What I’d do differently.">
        <Prose>
          <ul>
            <li>
              <strong>Test with real clinic staff earlier.</strong> I proposed and planned user testing before
              launch. Ideally it goes into the plan from week one, not at the end.
            </li>
            <li>
              <strong>Define success metrics up front.</strong> We shipped fast but didn’t instrument the launch. At
              Deaku I now set activation criteria before designing.
            </li>
            <li>
              <strong>Next on the roadmap</strong> was bringing Dash Vigorant into the new system and designing two
              more products on the same foundation.
            </li>
          </ul>
        </Prose>
        <Subheading>Beyond the brief</Subheading>
        <Prose>
          <p className="text-base text-muted">
            Mentored and onboarded a supporting designer · designed three marketing landing pages and an email
            template · contributed to the logo and brand book · designed the Borna AI website · completed HIPAA
            compliance training · introduced AI design tools to the team.
          </p>
        </Prose>
        <Quote name="Wareesha Khan" role="Product Designer, Vigorant">
          “It’s been a pleasure working alongside you and seeing your growth and impact in such a short time. Your
          contributions truly made a difference.”
        </Quote>
      </CaseSection>
    </>
  );
}
