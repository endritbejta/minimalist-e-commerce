/**
 * TermsOfService Component
 * Displays the legal terms and conditions for using the website.
 */
function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 md:py-24">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 tracking-tight">Terms of Service</h1>
      
      <div className="prose prose-lg text-gray-600 space-y-8 max-w-none">
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Terms</h2>
          <p>
            By accessing this website, you are agreeing to be bound by these website Terms and Conditions 
            of Use, all applicable laws and regulations, and agree that you are responsible for compliance 
            with any applicable local laws.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Use License</h2>
          <p>
            Permission is granted to temporarily download one copy of the materials (information or 
            software) on our website for personal, non-commercial transitory viewing only.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Disclaimer</h2>
          <p>
            The materials on our website are provided "as is". We make no warranties, expressed or 
            implied, and hereby disclaim and negate all other warranties, including without limitation, 
            implied warranties or conditions of merchantability, fitness for a particular purpose, or 
            non-infringement of intellectual property or other violation of rights.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Limitations</h2>
          <p>
            In no event shall we or our suppliers be liable for any damages (including, without 
            limitation, damages for loss of data or profit, or due to business interruption) arising 
            out of the use or inability to use the materials on our Internet site.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Governing Law</h2>
          <p>
            Any claim relating to our website shall be governed by the laws of the State without 
            regard to its conflict of law provisions.
          </p>
        </section>
      </div>
    </div>
  );
}

export default TermsOfService;
