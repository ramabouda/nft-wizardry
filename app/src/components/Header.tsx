
export default function Header() {
  return (
    <>
      <h1>
        <b> NFT Wizardry - Sybil resistant NFT gifts</b>
      </h1>
      <p>
        1. The frontend requests ZK Proofs via Sismo Connect Button <br />
        2. The user generates ZK Proofs in their Data Vault and sends the Sismo Connect response to
        the frontend <br />
        3. The frontend forwards the response to the backend via the login API route <br />
        4. The backend verifies the proofs contained in the response and starts a session<br />
        5. The frontend displays the Sismo Connect requests and verified result with a link to go to the game
      </p>
      <div>
        <p>
          <b className="code-snippet">src/app/sismo-connect-config.ts</b>: Sismo Connect
          configuration and requests
        </p>
        <p>
          <b className="code-snippet">src/app/page.tsx</b>: Frontend - make Sismo Connect request
        </p>
        <p>
          <b className="code-snippet">src/api/verify/route.ts</b>: Backend - verify Sismo Connect
          request
        </p>
        <p className="callout">
          {" "}
          Notes: <br />
          1. First ZK Proof generation takes longer time, especially with bad internet as there is a
          zkey file to download once in the data vault connection <br />
          2. The more proofs you request, the longer it takes to generate them (about 2 secs per
          proof)
        </p>
      </div>
    </>
  );
}
