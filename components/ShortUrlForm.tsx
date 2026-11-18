"use client";

import {type SubmitEvent, useState} from "react";
import styled from "styled-components";
import createShortUrl from "@/lib/createShortUrl";
import type {CreateShortUrlResult} from "@/types/CreateShortUrlResult";

const StyledMain = styled.main`
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px 20px;
    background: #f4f4f4;
    color: #111111;

    & section {
        width: min(600px, 100%);
        padding: 36px;
        border: 2px solid #111111;
        border-radius: 10px;
        background: #ffffff;
    }

    & header {
        margin-bottom: 28px;
        text-align: center;
    }

    & h1 {
        margin: 0 0 10px;
        font-size: calc(28px + 1vw);
    }

    & .subtitle {
        margin: 0;
        color: #555555;
        line-height: 1.5;
    }

    & form {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    & label {
        margin-top: 8px;
        font-size: calc(14px + .15vw);
        font-weight: 700;
    }

    & input {
        width: 100%;
        padding: 12px;
        border: 2px solid #111111;
        border-radius: 8px;
        background: #ffffff;
        color: #111111;
        outline: none;
    }

    & input:focus {
        box-shadow: 0 0 0 3px #dddddd;
    }

    & small {
        color: #666666;
        line-height: 1.4;
    }

    & button {
        margin-top: 14px;
        padding: 12px 18px;
        border: 2px solid #111111;
        border-radius: 8px;
        background: #111111;
        color: #ffffff;
        cursor: pointer;
        font-weight: 700;
        transition: .15s;
    }

    & button:hover:not(:disabled) {
        transform: scale(1.01);
        background: #333333;
    }

    & button:disabled {
        cursor: not-allowed;
        opacity: .6;
    }

    & .message {
        margin: 18px 0 0;
        padding: 12px;
        border: 2px solid #111111;
        border-radius: 8px;
    }

    & .error {
        background: #fff0f0;
        border-color: #9b1c1c;
        color: #7a1515;
    }

    & .result-label {
        display: block;
        margin-bottom: 8px;
        font-weight: 700;
    }

    & .result-row {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    & .result-row a {
        min-width: 0;
        flex: 1;
        overflow-wrap: anywhere;
    }

    & .copy-button {
        flex-shrink: 0;
        margin: 0;
        padding: 8px 14px;
    }

    & .copy-status {
        margin: 8px 0 0;
        color: #555555;
        font-size: 14px;
    }

    @media (max-width: 520px) {
        & section {
            padding: 24px 18px;
        }

        & .result-row {
            align-items: stretch;
            flex-direction: column;
        }
    }
`;

export default function ShortUrlForm() {
    const [result, setResult] = useState<CreateShortUrlResult>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [copyStatus, setCopyStatus] = useState("");

    const shortUrl = result.shortPath
        ? `${window.location.origin}${result.shortPath}`
        : "";

    async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();

        const form = event.currentTarget;

        setIsSubmitting(true);
        setResult({});
        setCopyStatus("");

        try {
            const nextResult = await createShortUrl(new FormData(form));
            setResult(nextResult);

            if (nextResult.shortPath) {
                form.reset();
            }
        } catch {
            setResult({
                error: "Could not reach the server. Please try again.",
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    async function copyShortUrl() {
        try {
            await navigator.clipboard.writeText(shortUrl);
            setCopyStatus("Copied to clipboard.");
        } catch {
            setCopyStatus("Copy failed. Select the link and copy it manually.");
        }
    }

    return (
        <StyledMain>
            <section>
                <header>
                    <h1>URL Shortener</h1>
                    <p className="subtitle">
                        Turn a long web address into a short, shareable link.
                    </p>
                </header>

                <form onSubmit={handleSubmit}>
                    <label htmlFor="url">Destination URL</label>
                    <input
                        id="url"
                        name="url"
                        type="url"
                        placeholder="https://example.com"
                        required
                    />

                    <label htmlFor="alias">Alias</label>
                    <input
                        id="alias"
                        name="alias"
                        type="text"
                        placeholder="example"
                        pattern="[A-Za-z0-9_-]+"
                        maxLength={40}
                        title="Use letters, numbers, underscores, and hyphens only."
                        required
                    />
                    <small>
                        Use up to 40 letters, numbers, underscores, or hyphens.
                    </small>

                    <button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Creating..." : "Create short URL"}
                    </button>
                </form>

                {result.error && (
                    <p className="message error" role="alert">
                        {result.error}
                    </p>
                )}

                {shortUrl && (
                    <div className="message" aria-live="polite">
                        <span className="result-label">Short URL</span>
                        <div className="result-row">
                            <a href={result.shortPath}>{shortUrl}</a>
                            <button
                                className="copy-button"
                                type="button"
                                onClick={copyShortUrl}
                            >
                                Copy
                            </button>
                        </div>
                        {copyStatus && (
                            <p className="copy-status">{copyStatus}</p>
                        )}
                    </div>
                )}
            </section>
        </StyledMain>
    );
}
