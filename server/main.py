from typing import Annotated

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


@app.post('/token', tags=['Login'])
def generate_token(input_data : OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = crud.authenticate_user(db, input_data.username, input_data.password)
    if not user:
        raise HTTPException(status_code=400, detail='Incorrect username or password')
    
    user_obj = schemas.User.from_orm(user)
    token = jwt.encode(user_obj.dict(), JWT_SECRET)

    return { 'access_token': token, 'token_type': 'bearer' }


@app.post('/languages/', response_model=schemas.Language, tags=['Languages'])
def create_language(language: schemas.LanguageCreate, db: Session = Depends(get_db)):
    db_languages = crud.get_languages(db)
    if language.title in [lang.title for lang in db_languages]:
        raise HTTPException(status_code=400, detail='Language already exists')
    return crud.create_language(db, language)


@app.get('/languages/', response_model=list[schemas.Language], tags=['Languages'])
def get_languages(db: Session = Depends(get_db)):
    return crud.get_languages(db)


@app.delete('/languages/{language_id}', response_model=bool, tags=['Languages'])
def delete_language(language_id: int, db: Session = Depends(get_db)):
    return crud.delete_language(db, language_id)


@app.put('/languages/{language_id}', response_model=bool, tags=['Languages'])
def update_language(language_id: int, language: schemas.LanguageCreate, db: Session = Depends(get_db)):
    return crud.update_language(db, language_id, language)


@app.get('/users/{user_id}', response_model=schemas.User, tags=['Users'])
def get_user(user_id: int, db: Session = Depends(get_db)):
    return crud.get_user(db, user_id)


@app.post('/users/', response_model=schemas.User, tags=['Users'])
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_login(db, user.login)
    if db_user:
        raise HTTPException(status_code=400, detail='Login already registered')
    return crud.create_user(db, user)


@app.get('/topics/', response_model=list[schemas.Topic], tags=['Topics'])
def get_topics(db: Session = Depends(get_db)):
    return crud.get_topics(db)


@app.post('/topics/', response_model=schemas.Topic, tags=['Topics'])
def create_topic(topic: schemas.TopicCreate, db: Session = Depends(get_db)):
    db_topics = crud.get_topics()
    if topic.title in [t.title for t in db_topics]:
        raise HTTPException(status_code=400, detail='Topic already exists')
    return crud.create_topic(db, topic)


@app.put('/topics/{topic_id}', response_model=bool, tags=['Topics'])
def update_topic(topic_id: int, topic: schemas.TopicCreate, db: Session = Depends(get_db)):
    return crud.update_topic(db, topic_id, topic)


@app.delete('/topics/{topic_id}', response_model=bool, tags=['Topics'])
def delete_topic(topic_id: int, db: Session = Depends(get_db)):
    return crud.delete_topic(db, topic_id)


@app.get('/words/{word_id}', response_model=schemas.Word, tags=['Words'])
def get_word(word_id: int, db: Session = Depends(get_db)):
    return crud.get_word(db, word_id)


@app.post('/words/', response_model=schemas.Word, tags=['Words'])
def create_word(word: schemas.WordCreate, db: Session = Depends(get_db)):
    return crud.create_word(db, word)


@app.put('/words/{word_id}', response_model=bool, tags=['Words'])
def update_word(word_id: int, word: schemas.WordCreate, db: Session = Depends(get_db)):
    return crud.update_word(db, word_id, word)


@app.delete('/words/{word_id}', response_model=bool, tags=['Words'])
def update_word(word_id: int, db: Session = Depends(get_db)):
    return crud.delete_word(db, word_id)
