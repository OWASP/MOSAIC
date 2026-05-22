
Meeting notes of the MOSAIC launch meeting during the AI Security Policy Forum in Washington DC, April 21st 2026, organized by OWASP AI Exchange with co-host SANS.

## What
On April 21, a major breakthrough in cybersecurity unfolded: leading standardization initiatives came together in Washington DC and agreed to begin coordinating collectively on AI security. The result: MOSAIC: Multi-Organization Secure AI Coordination. The goal: to turn a fragmented landscape into clear, consistent standards and guidelines for practitioners, to deal with the mounting risks of AI.

## Who
This important step was taken at the AI Security Policy Forum, organised and led by the OWASP AI Exchange, with SANS Institute as co-host - convening standard makers and policy stakeholders. This forum was invitation-only, had 24 seats, and was held under Chatham house rules. It is part of the AI Exchange mission to seek coordination and bring clarity to AI security practitioners - a mission shared with SANS Institute. The session of the policy forum included 24 people and was led by Rob van der Veer, founder of the AI Exchange.

The standard makers at the table included representatives from National Institute of Standards and Technology (NIST), International Telecommunications Union (ITU), OWASP AI Exchange, OWASP GenAI Security Project, Cloud Security Alliance (CSA), Center for Internet Security (CIS), Coalition for Secure AI (CoSAI), SANS Institute, and Berryville Institute for Machine Learning (BIML).

Where we say 'standardization', we mean the development of standards and guidelines that help different stakeholders understand and manage AI security. This includes organizations that build, deploy, procure, operate, assess, or regulate AI systems.


## Decisions

The group decided unanimously:

- to start coordinating collectively
- under the name MOSAIC
- using GitHub as a communication platform
- starting with a number of identified next steps (see below)
- while participants maintain independence
- and with the principle of preferring lightweight coordination over more committees
- the shared view is that  possibilities and challenges of AI are rapidly evolving, and AI adoption is currently vastly outpacing AI security, leaving security as an afterthought
- the shared view is that standards are currently fragmented, leading to uncertainty and a slowdown in innovation. A cohesive standards landscape is required to enable speed and safe adoption.

Points made during the session that were not argumented-against, which does not mean unanimous agreement:
1. Harominization: There is an urgent need for harmonization, particularly around definitions and taxonomy
2. Too many: We currently have too many standards. There is a critical need to establish consensus, coordinate, and extract best practices across the existing standards.
3. XKCD: We should keep the famous XKCD comic in mind about the aim to create a universal standard which then usually becomes yet another competing standard.
4. Swimlanes: We need clear 'swimlanes' to coordinate scopes across initiatives
5. Machine-readability: The future "readers" of standards will also be machines, not humans.
6. Deltas: Standard makers should ideally focus work on the deltas for the specific purpose and refer to existing work
7. Democratization: Everybody can make a standard with AI these days
8. Effectiveness: The effectiveness of AI security risk mitigation is typically uncertain. The residual risk is hard to predict and therefore there often are no recipes that guarantee security. This creates a challenge in setting a clear security bar.  How do you measure effectiveness of controls? There is a need to include measurability in the frameworks.
9. Honesty 1: It would be good to agree amongst standard initiatives that no initiative claims their standard guarantees security - in light of the previous point. By doing so we would prevent false security, and a situation where all standards are pretending they solve the security problem.
10. Honesty 2: We also should communicate that AI cannot be secured perfectly. It will always involve a degree of risk and risk acceptance.
11. Scope: Establishing scope can be helpful, for example to limit to CIA triad and intentionally exclude personal safety for example. 
12. OS Congress: We should look at Open Source Congress as a coordination model.


## Why
AI holds great promise, causing it to be connected to everything and trusted with sensitive data at a high pace. At the same time, 
many organizations are not yet prepared while standards and guidelines currently provide insufficient clarity and help. 
As a result, AI systems are becoming increasingly attractive targets for adversaries, something we already see in a growing number of incidents. 
When risks materialize, innovation slows down: projects pause, designs are revisited, and significant effort shifts to incident response and recovery.
What looks like speed at the start often leads to delay later.

This unprecedented moment calls for unprecedented collaboration between initiatives working on standards and guidelines, to exchange insights, improve consistency, clarity, quality, and prevent unnecessary duplication. 

## Next

Next steps identified by the group during the session:
1. Setup a new communication platform at OWASP Foundation GitHub, for all initiatives to join.
2. Through the platform, coordinate on a first topic that requires broad exchange: with NIST as convenor: Agent identity.
3. Decide on a standardized format to document individual initiatives - the 'initiative card'. This would become a central overview (i.e. map) of initiatives with information on positioning, results, and plans  (e.g. scope, geography, contact details, and links to roadmap, work streams, and deliverables). The map turns coordination into infrastructure: each initiative stays independent, each is visible to the others, and gaps or overlaps surface where they can be addressed rather than discovered the hard way.
4. Align on shared definitions of overarching topics such as safety, security and risk. Exact topics tbd, but at least 'risk', 'threat', and 'vulnerability'.
5. Construct a set of shared principles and rules of engagement, including for example how to grow and maintain the group of members, and machine readability of deliverables. 
6. Adding more members after establishing the growth principles.

## Who 2

In addition to the organizations mentioned, the discussion also included journalists and representatives from International Telecommunication Union (ITU), Aspen Institute, academia, and government — providing valuable perspectives on developments in both policy and industry. This helped prioritize the topics to focus on.

[![MOSAIC launching group](images/launchinggroup.jpg)](images/launchinggroup.jpg)

In the picture, from left to right, standing to sitting:

- Disesdi Shoshana Cox (AI Exchange)
- Gary McGraw (BIML)
- Rob van der Veer (AI Exchange)
- Anonymous
- Duncan Sparrell
- John Yeoh (CSA)
- Rock Lambros (GenAI security project)
- Norma Krayem
- Brian Calkin (CIS)
- Matt Altomare (Aspen Institute)
- Omar Santos (CoSAI)
- Aruneesh Salhotra (AI Exchange)
- Jonathan Gibson (The Dispatch)
- Apostol Vassilev (NIST)
- Rhea Nygard
- Ken Huang
- Lav Varshney (Stony Brook University)
- Sounil Yu (AI Defense Matrix
- Sharon Goldman (Fortune)

Not in the picture, but involved, in alphabetical order:
- Rob T. Lee (SANS)
- Ryan Galuzzo (NIST)
- Soribel Feliz


## Note from Rob van der Veer, meeting chair, added after the meeting:
Thank you all for attending the policy forum and the bravery of the decisions that we made together. To me personally, it means a lot, and I think this step will make a great difference for the practitioners out there, and in the end: for society.

I would like to bring forward these points to be discussed as potential part of next steps, and will make additional GitHub issues out of them: 
1. explore alignment with ISO/IEC JTC 1/SC 42
2. decide if we need and want a url and a landing page, and what that should be, and how to govern. We reserved mosaicstandards.org just to be safe.
3. explore how we can agree on principles of interoperability (e.g. the ability to deeplink with a hyperlink to a sub clause in a deliverable, machine readability
4. discuss how the 'democratisation' of standard making can be prevented to lead to too much noise
5. explore how we can build on the taxonomy developed by the AI Exchange using the open-source OpenCRE platform - mapping standards into a single, coherent resource that can be browsed, searched and queried using AI. This would serve as the much needed Rosetta Stone for AI security.

A big thank you to:
- Disesdi Shoshona Cox for coming up with the idea of having an event and shaping its form
- Violeta Klein for shaping the story presented at the Forum
- The amazing group at the AI Exchange, especially Yuvaraj for the work of his harmonization team
- Spyros Gasteratos for his great work on OpenCRE
- Straiker, Casco, AI Security Academy, and SANS Institute for supporting the Forum
- Software Improvement Group for donating the original threat model and initiating the AI Exchange
