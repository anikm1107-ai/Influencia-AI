const roleInputs = document.querySelectorAll('input[name="userRole"]');
const roleCards = document.querySelectorAll('.role-option');
const creatorCriteria = document.getElementById('creatorCriteria');
const recruiterCriteria = document.getElementById('recruiterCriteria');
const criteriaHint = document.getElementById('criteriaHint');
const prompt = document.getElementById('aiPrompt');
const charCount = document.getElementById('charCount');
const form = document.getElementById('aiForm');
const result = document.getElementById('aiResult');
const resultText = document.getElementById('resultText');

function updateRole() {
    const role = document.querySelector('input[name="userRole"]:checked').value;

    roleCards.forEach(card =>
        card.classList.toggle(
            'selected',
            card.querySelector('input').checked
        )
    );

    creatorCriteria.classList.toggle('hidden', role !== 'creator');
    recruiterCriteria.classList.toggle('hidden', role !== 'recruiter');

    criteriaHint.textContent = role === 'creator'
        ? 'Select what matters for your creator journey.'
        : 'Select the kind of creative talent or matching you need.';

    prompt.placeholder = role === 'creator'
        ? 'Example: I create Hindi storytelling videos and want to find a voice artist and thumbnail designer for my next series...'
        : 'Example: I am producing a Hindi horror series and need a storyteller, a voice artist and a thumbnail designer...';

    result.classList.add('hidden');
}

roleInputs.forEach(input =>
    input.addEventListener('change', updateRole)
);

prompt.addEventListener('input', () => {
    if (prompt.value.length > 1000) {
        prompt.value = prompt.value.slice(0, 1000);
    }

    charCount.textContent = `${prompt.value.length} / 1000`;
});

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const role = document.querySelector(
        'input[name="userRole"]:checked'
    ).value;

    const activeCriteria = role === 'creator'
        ? creatorCriteria
        : recruiterCriteria;

    const selected = [
        ...activeCriteria.querySelectorAll('input:checked')
    ].map(input => input.value);

    const message = prompt.value.trim();

    if (!message) {
        prompt.focus();
        prompt.setCustomValidity(
            'Please describe what you need help with.'
        );
        prompt.reportValidity();

        prompt.addEventListener(
            'input',
            () => prompt.setCustomValidity(''),
            { once: true }
        );

        return;
    }

    const language = document.getElementById('language').value;
    const style = document.getElementById('style').value;

    const details = [
        `Role: ${role === 'creator' ? 'Creator' : 'Recruiter'}`,
        `Request: ${message}`,
        `Criteria: ${selected.join(', ') || 'Not specified'}`,
        `Language: ${language || 'Not specified'}`,
        `Project style: ${style || 'Not specified'}`
    ];

    const aiPrompt = `
You are Influencia AI, an assistant that helps creators
and recruiters connect with creative talent.

Help the user with their request.

${details.join('\n')}

Give a useful, clear and practical response.
`;

    const submitButton = form.querySelector(
        'button[type="submit"], input[type="submit"]'
    );

    const originalButtonText = submitButton
        ? submitButton.textContent
        : '';

    if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Thinking...';
    }

    result.classList.remove('hidden');
    resultText.textContent = 'Influencia AI is thinking...';

    result.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
    });

    try {
        const response = await fetch(
            'http://localhost:5000/api/ai/chat',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    prompt: aiPrompt
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.error || 'AI request failed.'
            );
        }

        resultText.textContent = data.reply;

    } catch (error) {
        console.error('Influencia AI error:', error);

        resultText.textContent =
            'Sorry! Influencia AI could not respond. Please check that your backend is running and try again.';

    } finally {
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        }
    }
});

updateRole();