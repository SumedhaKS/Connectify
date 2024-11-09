
export function Signup() {
    return <div>
        <section className="signup-container">
        <form className="signup-form" action="/" method="post">
            <div id="signupDiv">
                <h2>SignUp</h2>
                <h3>Username</h3>
                <input id="nameEl" type="text" placeholder="Name" />
                <h3>Email</h3>
                <input id="emailEl" type="text" placeholder="Email" />
                <h3>Password</h3>
                <input id="passEl" type="password" placeholder="Password" />
                <h3>Re-Enter Password</h3>
                <input id="rePassEl" type="password" placeholder="Re-enter Password" /><br />
                <button id="buttonEl" type="submit">Submit</button>
            </div>
        </form>
        </section>
    </div>
}
