function TermsOfService() {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-semibold mb-4">Terms of Service</h1>
        <p>
          Welcome to Nook! By using this platform, you agree to the following terms:
        </p>
        <ul className="list-disc ml-6 my-4">
          <li>
            This platform is for educational and non-commercial use only.
          </li>
          <li>
            Users must not post or share content that violates copyright, privacy, or other legal obligations.
          </li>
          <li>
            Nook is not affiliated with Reddit or any other platform and operates independently.
          </li>
          <li>
            By using this platform, you accept that the project is provided "as is" with no guarantees.
          </li>
        </ul>
        <p>
          For any questions or concerns, please contact <a href="mailto:me@koussay.tn" className="underline">me@koussay.tn</a>.
        </p>
      </div>
    );
  }
  
  export default TermsOfService;
  