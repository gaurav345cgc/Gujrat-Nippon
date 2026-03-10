export default function RuleBasedChatbot() {
    return (
        <dialog open>
            <header>
                <h2>Need Help?</h2>
                <form method="dialog">
                    <button type="submit">Close</button>
                </form>
            </header>
            <section>
                <p>You can choose from these common questions:</p>
                <ul>
                    <li><button>What are your operating hours?</button></li>
                    <li><button>Where can I find compliance documents?</button></li>
                    <li><button>How do I get technical support?</button></li>
                </ul>
            </section>
            <footer>
                <p>Or talk to a human:</p>
                <form action="/api/lead" method="POST">
                    <label htmlFor="bot-email">Your Email</label>
                    <input type="email" id="bot-email" name="email" required />
                    <button type="submit">Start Chat</button>
                </form>
            </footer>
        </dialog>
    );
}
