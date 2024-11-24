<template>
  <div class="terms-page">
    <div class="container">
      <h1>Terms and Conditions</h1>
      
      <div class="terms-content">
        <section>
          <h2>1. Introduction</h2>
          <p>Welcome to Schuhvana. By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.</p>
        </section>

        <section>
          <h2>2. Use License</h2>
          <p>Permission is granted to temporarily download one copy of the materials (information or software) on Schuhvana's website for personal, non-commercial transitory viewing only.</p>
        </section>

        <section>
          <h2>3. Disclaimer</h2>
          <p>The materials on Schuhvana's website are provided on an 'as is' basis. Schuhvana makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
        </section>

        <section>
          <h2>4. Limitations</h2>
          <p>In no event shall Schuhvana or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Schuhvana's website.</p>
        </section>

        <section>
          <h2>5. Accuracy of Materials</h2>
          <p>The materials appearing on Schuhvana's website could include technical, typographical, or photographic errors. Schuhvana does not warrant that any of the materials on its website are accurate, complete, or current.</p>
        </section>

        <section>
          <h2>6. Links</h2>
          <p>Schuhvana has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Schuhvana of the site.</p>
        </section>

        <section>
          <h2>7. Modifications</h2>
          <p>Schuhvana may revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.</p>
        </section>

        <section>
          <h2>8. Governing Law</h2>
          <p>These terms and conditions are governed by and construed in accordance with the laws and you irrevocably submit to the exclusive jurisdiction of the courts in that location.</p>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Terms'
};
</script>

<style scoped>
.terms-page {
  padding: 2rem 0;
  background-color: #f9fafb;
  min-height: calc(100vh - 64px);
}

.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 1rem;
}

h1 {
  text-align: center;
  color: #1f2937;
  margin-bottom: 2rem;
}

.terms-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

section {
  margin-bottom: 2rem;
}

section:last-child {
  margin-bottom: 0;
}

h2 {
  color: #1f2937;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

p {
  color: #4b5563;
  line-height: 1.6;
  margin-bottom: 1rem;
}

@media (max-width: 768px) {
  .terms-content {
    padding: 1.5rem;
  }
  
  h2 {
    font-size: 1.25rem;
  }
}
</style>
