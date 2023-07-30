import './style.css';
import { openDB } from 'idb';

const DB_NAME = 'text_editor_db';
const STORE_NAME = 'text_content';

const initIndexedDB = () => {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(DB_NAME, 1);

    request.onerror = () => {
      reject('Error opening IndexedDB');
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    };
  });
};

const saveContent = (content) => {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await initIndexedDB();
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const entry = { content };
      const request = store.add(entry);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject('Error saving content to IndexedDB');
      };
    } catch (error) {
      reject(error);
    }
  });
};

const getContent = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await initIndexedDB();
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject('Error retrieving content from IndexedDB');
      };
    } catch (error) {
      reject(error);
    }
  });
};

// Text Editor Logic
const textEditor = document.getElementById('text-editor');
const saveButton = document.getElementById('save-button');

// Add event listener after the document is loaded
document.addEventListener('DOMContentLoaded', async () => {
  // Initialize the text editor with previously saved content
  try {
    const entries = await getContent();
    if (entries.length > 0) {
      const lastEntry = entries[entries.length - 1];
      textEditor.value = lastEntry.content;
    }
  } catch (error) {
    console.error('Error retrieving content:', error);
  }

  // Add event listeners
  textEditor.addEventListener('input', () => {
    const content = textEditor.value;
    saveContent(content)
      .then(() => {
        console.log('Content saved successfully!');
      })
      .catch((error) => {
        console.error('Error saving content:', error);
      });
  });

  saveButton.addEventListener('click', () => {
    const content = textEditor.value;
    saveContent(content)
      .then(() => {
        console.log('Content saved successfully!');
      })
      .catch((error) => {
        console.error('Error saving content:', error);
      });
  });
});
