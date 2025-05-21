import React from "react";
import MenuScreenLayout from "@/components/layouts/MenuScreenLayout";
import { Text } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const Content = `
Privacy Policy for Yallaadubai.com
Effective Date: November 28, 2024
At Yallaadubai.com, operated by Key Point FZE, we value your privacy and are committed to protecting your personal data. This policy outlines how we collect, use, store, and protect your data in accordance with UAE data protection laws.

1. Scope of the Privacy Policy
This Privacy Policy explains how we handle your personal data through your use of Yallaadubai.com and associated mobile applications ("Platform"). By using the Platform, you consent to the practices outlined in this policy.
2. Who We Are and How to Contact Us
Key Point FZE operates Yallaadubai.com and is the data controller.
For privacy concerns, contact us at:
Email: waqas.mustafa@yallaadubai.com

3. Personal Data We Collect from You
Category	Examples
Identity Data	Name, username, profile photo, government ID for verification (e.g., Emirates ID).
Contact Data	Email address, phone number.
Location Data	Approximate location from device settings (if enabled).
Listings Data	Details of your listings, viewed listings, and interactions with other users.
Chat Data	Messages exchanged with users via the Platform.
Call Data	Recordings of calls with our team for monitoring and training.
Technical Data	IP address, browser type, operating system, device details, and usage patterns.
Marketing Data	Preferences for receiving marketing communications.
We also collect aggregated data (statistical or demographic) for analysis, which does not identify individuals directly.

4. Personal Data from Other Sources
We may collect data from:
Social Media Platforms: Identity and contact data if you link accounts.
Affiliates: Shared data for enhanced services.
Analytics Providers and Advertisers: Behavioral and technical data for targeted marketing.

5. How We Use Your Personal Data
Purpose	Data Categories	Legal Basis
Account Creation	Identity, Contact	Contractual necessity
Verification	Identity, Contact	Contractual necessity
Service Operation	Identity, Contact, Listings	Contractual necessity
Marketing	Contact, Marketing	Consent
Fraud Prevention	Identity, Contact	Compliance with law

6. Data Sharing
We may share your data with:
Other Users: To facilitate transactions and communication.
Service Providers: IT, payment processing, marketing services.
Authorities: When legally required.
Acquirers: In case of mergers or business transfers.

7. International Data Transfers
Your data may be transferred outside the UAE where necessary. We ensure compliance with applicable laws for secure cross-border transfers.

8. Data Security
We implement security measures to protect your personal data from unauthorized access or misuse. Access is restricted to staff with a business need.

9. Data Retention
We retain your data as long as necessary for the purposes stated or as required by law. Anonymized data may be retained indefinitely.

10. Your Rights
Depending on the applicable law, you may have rights to:
Access: Request a copy of your data.
Correction: Request correction of inaccurate data.
Erasure: Request deletion of your data.
Objection: Object to data processing for specific purposes.
Data Portability: Request transfer of your data in a structured format.
To exercise these rights, contact waqas.mustafa@yallaadubai.com.

11. Marketing Communications
You can manage your marketing preferences in your account settings or opt out via the "Unsubscribe" link in our emails.

12. Minors
The Platform is not intended for minors. If you become aware of unauthorized use by a minor, please contact us for removal.

13. Third-Party Links
Our Platform may link to third-party sites. We are not responsible for their privacy practices and encourage you to review their policies.

14. Changes to the Privacy Policy
We may update this policy at any time. Changes will be effective upon posting on this page, and significant updates may be communicated via email.

If you have any concerns or complaints, contact waqas.mustafa@yallaadubai.com. We aim to resolve issues promptly and fairly.
`;

const PrivacyPolicy = () => {
  return (
    <MenuScreenLayout title="Privacy Policy">
      <ScrollView contentContainerClassName="p-4">
        <Text className=" text-gray-600 text-lg text-center">{Content}</Text>
      </ScrollView>
    </MenuScreenLayout>
  );
};

export default PrivacyPolicy;
