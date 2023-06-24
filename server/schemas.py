from pydantic import BaseModel


class LanguageBase(BaseModel):
    title: str


class LanguageCreate(LanguageBase):
    pass


class Language(LanguageBase):
    id: int

    class Config:
        orm_mode = True


class UserBase(BaseModel):
    login: str


class UserCreate(UserBase):
    password: str
    native_language_id: int


class User(UserBase):
    id: int
    native_language: Language

    class Config:
        orm_mode = True


class TopicBase(BaseModel):
    title: str


class TopicCreate(TopicBase):
    pass


class Topic(TopicBase):
    id: int

    class Config:
        orm_mode = True


class TranslationBase(BaseModel):
    title: str
    pronunciation: str | None = None


class TranslationCreate(TranslationBase):
    language_id: int


class Translation(TranslationBase):
    id: int
    language: Language

    class Config:
        orm_mode = True


class WordBase(BaseModel):
    title: str
    pronunciation: str


class WordCreate(WordBase):
    language_id: int
    topic_id: int | None = None


class Word(WordBase):
    id: int
    language: Language
    topic: Topic

    class Config:
        orm_mode = True
