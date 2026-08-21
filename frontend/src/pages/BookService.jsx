
import SEO from "@/components/site/SEO";
import PageHeader from "@/components/site/PageHeader";

import Reviews from "@/components/site/Reviews";
import Faq from "@/components/site/Faq";





export default function BookService() {
 

  

  return (
    <>
      <SEO
        title="Book Royal Enfield Service Online — Gachibowli"
        description="Book your Royal Enfield service online at The Bullet Zone, Gachibowli, Hyderabad. Share your bike model and preferred date — we'll confirm your slot over call or WhatsApp."
        path="/book"
      />
      <PageHeader
        chapter="Book Service"
        title="Reserve your slot in minutes"
        subtitle="Tell us about your Royal Enfield and when you'd like to come in. We'll confirm your booking over a call or WhatsApp."
      />

     

      <Reviews />
      <Faq />
    </>
  );
}
