import { responses } from "./data.js";

//
const conversation = document.querySelector('#conversation');
const inputArea = document.querySelector('#inputArea');
const textarea = document.querySelector('#query');
const button = document.querySelector('#run');
const heading = document.querySelector('h1');

let sessionMessages = 0;
const responseQueues = {};

//
const toggleButton = (length) => length > 0 ? button.removeAttribute('disabled') : button.setAttribute('disabled', '');

const shuffle = (length) => {
    const indices = Array.from({ length }, (_, i) => i);

    for (let i = length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
    }

    return indices;
};

const randomResponse = (label) => {

    const array = responses[label];
    if (!array || array.length === 0) return undefined;

    if (!responseQueues[label] || responseQueues[label].length === 0) {
        responseQueues[label] = shuffle(array.length);
    }

    const random = responseQueues[label].pop();
    const response = array[random];

    return response;

};

const buildResponse = () => {

    if (sessionMessages > 0) {

        return randomResponse("indifferent");

    } else {

        const random = shuffle(2);

        if (random[0] === 0) return `${randomResponse("intro")} ${randomResponse("reasons")}`
        else return randomResponse("single")

    }

}

const loadResponse = () => {

    const container = document.createElement('div');
    const message = document.createElement('p');
    const spinner = document.createElement('img');

    container.classList.add('working');
    message.innerHTML = randomResponse("loadingTerms");
    spinner.setAttribute('src', 'asset/img/spinner.svg');
    spinner.setAttribute('alt', 'spinner');

    container.append(message);
    container.append(spinner);
    inputArea.append(container);

    return container;

}

const addResponse = () => {

    let loading = loadResponse();
    const response = document.createElement('p');
    response.classList.add('response');
    response.innerHTML = buildResponse();

    setTimeout(() => {

        loading.classList.add('-off');

        setTimeout(() => {

            conversation.append(response);
            textarea.removeAttribute('disabled');
            loading.remove();

            response.scrollIntoView({
                behavior: 'smooth', 
                block: 'end' 
            })

        }, 250)
        

    }, 2500)

    sessionMessages += 1

}

const addUserMessage = (message) => {

    if (!heading.classList.contains('-off')) heading.classList.add('-off');

    const container = document.createElement('p');
    container.classList.add('user');
    container.innerHTML = message;

    conversation.append(container);
    textarea.value = '';
    toggleButton(textarea.value.length);
    textarea.setAttribute('disabled', '');
    textarea.setAttribute('placeholder', '');

    addResponse();

    container.scrollIntoView({
        behavior: 'smooth', 
        block: 'end' 
    })

}

//

textarea.addEventListener('keyup', () => {

    let value = textarea.value.replaceAll('\n', '')

    toggleButton(value.length);

})

textarea.addEventListener('keydown', (e) => {

    if (e.key === "Enter" && !button.hasAttribute('disabled')) {

        if (!e.shiftKey) {

            e.preventDefault();
            addUserMessage(textarea.value);

        }

    }

})

button.addEventListener('click', () => {
    
    const message = textarea.value;

    addUserMessage(message);

})

