from fastapi import Depends, FastAPI, HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
import jwt

from . import crud, models, schemas
from .database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

oauth2 = OAuth2PasswordBearer(tokenUrl='token')

JWT_SECRET = '$2b$12$50OSYQEpRgfXG/26CboDvuzjWS5Vb3ENN8TwiqIAFBWjKgE9Z9LK.'


# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.post('/token', tags=['Login'], operation_id='login')
def generate_token(input_data : OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = crud.authenticate_user(db, input_data.username, input_data.password)
    if not user:
        raise HTTPException(status_code=400, detail='Incorrect username or password')
    
    user_obj = schemas.User.from_orm(user)
    token = jwt.encode(user_obj.dict(), JWT_SECRET)

    return { 'access_token': token, 'token_type': 'bearer' }


@app.get('/languages/', response_model=list[schemas.Language], tags=['Languages'], operation_id='GetAll')
def get_languages(db: Session = Depends(get_db)):
    return crud.get_languages(db)


@app.post('/languages/', response_model=schemas.Language, tags=['Languages'], operation_id='Insert')
def create_language(language: schemas.LanguageCreate, db: Session = Depends(get_db), token: str = Depends(oauth2)):
    db_languages = crud.get_languages(db)
    if language.title in [lang.title for lang in db_languages]:
        raise HTTPException(status_code=400, detail='Language already exists')
    return crud.create_language(db, language)


@app.delete('/languages/{language_id}', response_model=bool, tags=['Languages'], operation_id='Delete')
def delete_language(language_id: int, db: Session = Depends(get_db), token: str = Depends(oauth2)):
    return crud.delete_language(db, language_id)


@app.put('/languages/{language_id}', response_model=bool, tags=['Languages'], operation_id='Update')
def update_language(language_id: int, language: schemas.LanguageCreate, db: Session = Depends(get_db), token: str = Depends(oauth2)):
    return crud.update_language(db, language_id, language)


@app.get('/users/{user_id}', response_model=schemas.User, tags=['Users'], operation_id='Get')
def get_user(user_id: int, db: Session = Depends(get_db), token: str = Depends(oauth2)):
    return crud.get_user(db, user_id)


@app.post('/users/', response_model=schemas.User, tags=['Users'], operation_id='Insert')
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db), token: str = Depends(oauth2)):
    db_user = crud.get_user_by_login(db, user.login)
    if db_user:
        raise HTTPException(status_code=400, detail='Login already registered')
    return crud.create_user(db, user)


@app.get('/topics/', response_model=list[schemas.Topic], tags=['Topics'], operation_id='GetAll')
def get_topics(db: Session = Depends(get_db)):
    return crud.get_topics(db)


@app.post('/topics/', response_model=schemas.Topic, tags=['Topics'], operation_id='Insert')
def create_topic(topic: schemas.TopicCreate, db: Session = Depends(get_db), token: str = Depends(oauth2)):
    db_topics = crud.get_topics()
    if topic.title in [t.title for t in db_topics]:
        raise HTTPException(status_code=400, detail='Topic already exists')
    return crud.create_topic(db, topic)


@app.put('/topics/{topic_id}', response_model=bool, tags=['Topics'], operation_id='Update')
def update_topic(topic_id: int, topic: schemas.TopicCreate, db: Session = Depends(get_db), token: str = Depends(oauth2)):
    return crud.update_topic(db, topic_id, topic)


@app.delete('/topics/{topic_id}', response_model=bool, tags=['Topics'], operation_id='Delete')
def delete_topic(topic_id: int, db: Session = Depends(get_db), token: str = Depends(oauth2)):
    return crud.delete_topic(db, topic_id)


@app.get('/translations/{translation_id}', response_model=schemas.Translation, tags=['Translations'], operation_id='Get')
def get_translation(translation_id: int, db: Session = Depends(get_db)):
    return crud.get_translation(db, translation_id)


@app.get('/translations/by_word/{word_id}', response_model=schemas.Translation, tags=['Translations'], operation_id='GetByWordId')
def get_translation_by_word(word_id: int, db: Session = Depends(get_db)):
    return crud.get_translations_by_word(db, word_id)


@app.post('/translations/', response_model=schemas.Translation, tags=['Translations'], operation_id='Insert')
def create_translation(translation: schemas.TranslationCreate, db: Session = Depends(get_db), token: str = Depends(oauth2)):
    return crud.create_translation(db, translation)


@app.put('/translations/{translation_id}', response_model=bool, tags=['Translations'], operation_id='Update')
def update_translation(translation_id: int, translation: schemas.TranslationCreate, db: Session = Depends(get_db), token: str = Depends(oauth2)):
    return crud.update_translation(db, translation_id, translation)


@app.delete('/translations/{translation_id}', response_model=bool, tags=['Translations'], operation_id='Delete')
def delete_translation(translation_id: int, db: Session = Depends(get_db), token: str = Depends(oauth2)):
    return crud.delete_translation(db, translation_id)


@app.get('/words/{word_id}', response_model=schemas.Word, tags=['Words'], operation_id='Get')
def get_word(word_id: int, db: Session = Depends(get_db)):
    return crud.get_word(db, word_id)


@app.post('/words/', response_model=schemas.Word, tags=['Words'], operation_id='Insert')
def create_word(word: schemas.WordCreate, db: Session = Depends(get_db), token: str = Depends(oauth2)):
    return crud.create_word(db, word)


@app.put('/words/{word_id}', response_model=bool, tags=['Words'], operation_id='Update')
def update_word(word_id: int, word: schemas.WordCreate, db: Session = Depends(get_db), token: str = Depends(oauth2)):
    return crud.update_word(db, word_id, word)


@app.delete('/words/{word_id}', response_model=bool, tags=['Words'], operation_id='Delete')
def update_word(word_id: int, db: Session = Depends(get_db), token: str = Depends(oauth2)):
    return crud.delete_word(db, word_id)

@app.get('/words/', response_model=list[schemas.Word], tags=['Words'], operation_id='GetAll')
def get_words(language_id: int | None = None, translation_language_id: int | None = None, topic_id: int | None = None, db: Session = Depends(get_db)):
    return crud.get_words(db, language_id, translation_language_id, topic_id)

@app.get('/words/random/', response_model=list[schemas.Word], tags=['Words'], operation_id='GetRandomSet')
def get_random_words(language_id: int, translation_language_id: int, count: int, topic_id: int | None = None, db: Session = Depends(get_db)):
    return crud.get_random_words(db, language_id, translation_language_id, count, topic_id)
