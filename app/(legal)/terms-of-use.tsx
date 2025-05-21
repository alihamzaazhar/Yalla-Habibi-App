import React from "react";
import MenuScreenLayout from "@/components/layouts/MenuScreenLayout";
import { Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const Content = `
Terms of Use for Yallaadubai.com
Effective Date: November 28, 2024
1. Introduction
Welcome to Yallaadubai.com ("the Platform"), operated by Key Point FZE. By accessing or using our Platform, you agree to comply with these Terms of Use. For support, please contact us at waqas.mustafa@yallaadubai.com.
2. Definitions
"User": Any person using the Platform.
"Listing": An advertisement posted by a user.
"Services": The property sale, vehicle sale, property rental, and coupon advertising services offered.
3. Eligibility
Users must be at least 18 years old and legally capable of entering into contracts under UAE law.
4. Scope of Services
Property Sales & Rentals: Users can post and browse property listings for sale or rent.
Vehicle Sales: Listings for cars, bikes, and trucks are available.
Coupons: Businesses and individuals may advertise coupons or offers.
Advertising: Direct advertisement services for businesses are available.
5. User Responsibilities
Users must ensure all information provided in listings is accurate and lawful.
Users are prohibited from posting offensive, defamatory, or illegal content.
6. Prohibited Activities
Users must not:
Violate any UAE laws.
Post misleading or fraudulent listings.
Engage in any unauthorized use of the Platform.
7. Payments and Fees
Fees for premium listings or advertising are non-refundable. VAT will be applied as per UAE regulations.
8. Privacy Policy
Refer to our Privacy Policy for details on how we collect and process user data in compliance with UAE data protection laws.
9. Intellectual Property
All content on Yallaadubai.com is protected by copyright and trademark laws. Users must not use Platform content for commercial purposes without authorization.
10. Liability
Key Point FZE is not liable for:
The accuracy of listings or user content.
Any loss resulting from Platform use.
11. Governing Law and Jurisdiction
These Terms are governed by UAE law. Disputes will be resolved under the jurisdiction of UAE courts.
12. Changes to Terms
Key Point FZE reserves the right to modify these Terms at any time. Updates will be posted on this page.
13. Contact Information
For any inquiries, please email waqas.mustafa@yallaadubai.com.

`;

const TermsOfUse = () => {
  return (
    <MenuScreenLayout title="Terms Of Use">
      <ScrollView contentContainerClassName="p-4">
        <Text className=" text-gray-600 text-lg text-center">{Content}</Text>
      </ScrollView>
    </MenuScreenLayout>
  );
};

export default TermsOfUse;
