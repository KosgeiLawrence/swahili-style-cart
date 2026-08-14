# Swahili Style Collective

Build Prompt: Swahili Design Lab Sustainable Fashion Marketplace

Create a simple, premium, modern sustainable fashion marketplace for Swahili Design Lab, hosted at:

swahilidesignlab.co.ke

The website should showcase and sell sustainable fashion products and handmade/upcycled designs created by Swahili Design Lab and its designers.

The overall experience should feel clean, artistic, African-inspired, sustainable, premium, and modern without being complicated.

1. Core Design Direction

Use a Glassmorphism + Minimal Editorial Fashion design style.

The site should feel similar to a modern sustainable fashion brand rather than a generic e-commerce template.

Primary brand color

Use:

#24D1FC

Use this color strategically for:

Primary buttons

Active navigation states

Links

Small highlights

Icons

Borders/glows where appropriate

Important call-to-action elements

Text

Use black (#000000) as the primary text color.

Use white and very light neutral backgrounds to create contrast.

Avoid excessive use of the blue color. It should be an accent color, not the entire background.

Glassmorphism

Use subtle glass effects:

Semi-transparent white cards

backdrop-filter: blur()

Soft borders

Very subtle shadows

Rounded corners

Light transparency

Minimal gradients

Do NOT make the entire website look like a futuristic dashboard.

The glass effect should be elegant and subtle, suitable for a sustainable fashion marketplace.

2. Typography

Use a modern premium sans-serif font.

Preferred font:

Space Grotesk

Use:

Space Grotesk Bold/Semibold for headings

Space Grotesk Medium for buttons and navigation

Space Grotesk Regular for body text

The typography should be clean, spacious and editorial.

Use generous whitespace.

3. Logo and Favicon

Use the attached Swahili Design Lab logo as the official website logo.

Do not redesign or replace the logo.

Use the logo in:

Navigation bar

Footer

Login/register pages where appropriate

Create a favicon from the supplied logo.

The favicon must be converted into a web-compatible format that can be rendered reliably by browsers and deployed on a hosting platform.

Prefer:

favicon.svg

favicon.ico

PNG fallback where appropriate

Include the correct favicon references inside index.html.

Make sure the favicon works when the SPA is deployed to normal web hosting/cPanel.

4. Website Architecture

Build the website as a:

Plain Single Page Application (SPA)

The deployment must be simple.

The final production structure must have:

index.html

as the main entry point.

Avoid unnecessary backend infrastructure unless absolutely required.

The application should be structured so it can easily be deployed to standard hosting.

The website should be optimized for:

Desktop

Tablet

Mobile

5. Main Navigation

Create a simple navigation bar containing:

Swahili Design Lab Logo

Navigation:

Home

Shop

Collections

About

My Account

Cart

Primary CTA:

Explore Collection

Keep the navigation minimal.

On mobile, convert the navigation into a clean hamburger menu.

6. Homepage

Create a visually strong but simple homepage.

Hero Section

Headline:

Sustainable Fashion, Designed With Purpose.

Supporting text:

Discover thoughtfully designed fashion and lifestyle pieces created through creativity, circularity and responsible design.

Buttons:

Shop Collection

Explore Our Story

Use a beautiful fashion/product image or product collage.

The hero should have subtle glassmorphism elements and a very clean editorial layout.

Do not overcrowd the hero.

Featured Collections

Display 3–4 collections such as:

Upcycled Fashion

Sustainable Bags

Reimagined Textiles

Limited Editions

Use large image cards with subtle hover animations.

Featured Products

Display a grid of products.

Each product card should contain:

Product image

Product name

Short description

Price in KES

Availability status

Add to Cart button

View Product button

Example:

Reclaimed Textile Tote

KES 2,500

Add to Cart

Sustainability Section

Create a section explaining the philosophy behind the marketplace.

Headline:

Fashion That Gives Materials Another Life.

Explain that Swahili Design Lab works with sustainable materials, creative reuse, responsible production and innovative design.

Use simple statistics or impact cards where appropriate.

Call to Action

End the homepage with:

Wear the Change.

Supporting text:

Explore our collection of sustainable designs and support a new generation of responsible fashion.

Button:

Shop Sustainable Fashion

7. Shop Page

Create a simple marketplace/product catalogue.

Include:

Search

Category filter

Collection filter

Price filter

Sort by

Product grid

Categories could include:

Bags

Clothing

Accessories

Home & Lifestyle

Upcycled Products

Limited Editions

Do not create an overly complicated filtering system.

The goal is to make shopping extremely easy.

8. Product Page

Every product should have a dedicated product view.

Include:

Large product images

Product name

Price in KES

Product description

Materials

Sustainability information

Available quantity

Size/options where applicable

Quantity selector

Add to Cart

Buy/Order button

Include a section:

Why This Product Is Sustainable

This should explain the material or circular design approach used to create the product.

9. Shopping Cart

Create a simple cart system.

Users should be able to:

Add products

Remove products

Increase/decrease quantity

View subtotal

View total

Continue shopping

Proceed to order

The cart should persist during the user's session.

If practical, use local storage so that the cart remains available after refreshing the page.

10. User Accounts

Allow users to:

Create an account

Log in

Log out

Manage their profile

View their orders

View order status

Manage basic account information

The account interface should remain simple.

Do not build a complicated customer dashboard.

Create a clean My Account page with:

Profile

My Orders

Order History

Account Settings

Logout

11. Checkout / Ordering System

IMPORTANT:

Do NOT create a complicated automated payment checkout.

The purchasing process should work as an order request system.

The user adds products to their cart and proceeds to checkout.

Collect:

Full name

Email

Phone number

Delivery location

County/City

Additional delivery notes

Show:

Order Summary

Products

Quantities

Prices

Total estimated amount

Then show a clear button:

Place Order

After clicking Place Order, display:

Order Received

Thank you for your order!

Your order has been received successfully. Our team will contact you shortly to confirm your order, availability, delivery details and payment arrangements.

Generate an order/reference number.

Example:

SDL-2026-00124

The customer should also receive a confirmation through the available communication method.

The order should be recorded so that the Swahili Design Lab team can follow up with the customer.

12. Important Checkout Principle

Do NOT make customers create unnecessary steps.

The ideal flow is:

Browse → Product → Add to Cart → Checkout → Place Order → Swahili Design Lab Contacts Customer

Keep this flow extremely simple.

13. Order Management

Create an internal/admin-friendly structure for orders if supported by the chosen architecture.

Orders should contain:

Order number

Customer name

Phone

Email

Products

Quantity

Total

Delivery location

Date

Order status

Possible statuses:

New Order

Contacted

Confirmed

Processing

Ready for Delivery

Delivered

Cancelled

Do not expose administrative functionality to normal customers.

14. Search

Create a simple product search.

Users should be able to search by:

Product name

Category

Collection

Show a clean "No products found" message when appropriate.

15. Product Cards

Product cards should have a premium fashion look.

Use:

Large imagery

Rounded corners

Subtle glass overlay

Minimal text

Smooth hover effect

Blue accent #24D1FC

Avoid excessive badges and buttons.

16. Animations

Use subtle animations only.

Examples:

Fade-in

Soft slide-up

Hover elevation

Image zoom on hover

Smooth navigation transitions

Do NOT use excessive animations.

The website should feel premium and calm.

17. Mobile Experience

Mobile responsiveness is extremely important.

On mobile:

Navigation becomes a hamburger menu

Product grid becomes 1–2 columns

Cart remains easily accessible

Checkout becomes a simple vertical form

Buttons should be large enough to tap

Images should remain high quality

Text should remain readable

The mobile experience should feel like a modern fashion shopping app.

18. Footer

Create a clean footer containing:

Swahili Design Lab

Sustainable Fashion. Responsible Design.

Links:

Shop

Collections

About

Contact

My Account

Privacy Policy

Terms & Conditions

Website:

swahilidesignlab.co.ke

Include social media icons where appropriate.

19. SEO

Optimize the SPA for search engines.

Include:

Title:

Swahili Design Lab | Sustainable Fashion & Circular Design

Meta description:

Discover sustainable fashion, upcycled products and innovative designs from Swahili Design Lab. Shop consciously designed products created with sustainability and circularity in mind.

Use proper:

H1

H2

H3

Alt text

Semantic HTML

Open Graph metadata

Favicon metadata

20. Technical Requirements

Build the application as a lightweight SPA.

Prioritize:

Fast loading

Clean code

Responsive design

Accessibility

SEO

Simple deployment

Minimal dependencies

Secure handling of user information

Avoid unnecessary libraries and complicated infrastructure.

The final website should be deployable to:

swahilidesignlab.co.ke

using standard web hosting.

21. Visual Identity

The final visual identity should communicate:

Sustainable + African + Creative + Contemporary + Premium

Do NOT make it look like:

A generic Shopify store

A corporate website

A complicated SaaS dashboard

A cryptocurrency website

A futuristic tech interface

Instead, make it feel like a premium contemporary sustainable fashion marketplace.

Use the #24D1FC cyan accent + black typography + white/light neutral surfaces + subtle glassmorphism.

22. User Experience Goal

The most important objective is simplicity.

A first-time visitor should immediately understand:

What is this?

→ A sustainable fashion marketplace by Swahili Design Lab.

What can I do?

→ Browse and order sustainable products.

How do I buy?

→ Add to cart → Checkout → Place Order → Swahili Design Lab contacts me.

Keep everything else secondary.

23. Final Deliverable

Generate the complete production-ready website.

The final application should include:

Homepage

Shop

Collections

Product pages

Search

Cart

Checkout/order request

User registration

Login

My Account

Order history

Order confirmation

About page

Contact section

Footer

Responsive mobile design

SEO metadata

Favicon

Supplied Swahili Design Lab logo

Glassmorphism visual system

#24D1FC brand accent

Black typography

Space Grotesk font

Use realistic sustainable-fashion placeholder products and images where actual product data is not yet available, but structure the application so the products can easily be replaced with real Swahili Design Lab products later.

Do not over-engineer the website. Prioritize simplicity, beauty, speed, usability and easy deployment.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://swahili-style-cart.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/674b0d20-795e-402f-b9ff-2ee939ee430d).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
