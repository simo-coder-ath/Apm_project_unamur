--
-- PostgreSQL database dump
--

\restrict m58wYEniKyq02bCCL5IL98HOA2lBSY3HCpd8qzM5OF0V94APzHUYMZ2Pz9llUwz

-- Dumped from database version 16.10
-- Dumped by pg_dump version 16.10

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: activity; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.activity (
    id integer NOT NULL,
    name character varying(64),
    description character varying(64),
    lastupdate timestamp without time zone,
    lastupdatebyid integer
);


ALTER TABLE public.activity OWNER TO postgres;

--
-- Name: activity_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.activity_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.activity_id_seq OWNER TO postgres;

--
-- Name: activity_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.activity_id_seq OWNED BY public.activity.id;


--
-- Name: affinitypractice; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.affinitypractice (
    id integer NOT NULL,
    itemid integer NOT NULL,
    practiceversionid integer NOT NULL,
    x integer DEFAULT 0,
    y integer DEFAULT 0
);


ALTER TABLE public.affinitypractice OWNER TO postgres;

--
-- Name: affinitypractice_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.affinitypractice_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.affinitypractice_id_seq OWNER TO postgres;

--
-- Name: affinitypractice_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.affinitypractice_id_seq OWNED BY public.affinitypractice.id;


--
-- Name: affinitysurvey; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.affinitysurvey (
    id integer NOT NULL,
    content character varying(255) NOT NULL,
    description character varying(255),
    comment character varying(255),
    trait character(1),
    CONSTRAINT affinitysurvey_trait_check CHECK ((trait = ANY (ARRAY['O'::bpchar, 'C'::bpchar, 'E'::bpchar, 'A'::bpchar, 'N'::bpchar])))
);


ALTER TABLE public.affinitysurvey OWNER TO postgres;

--
-- Name: affinitysurvey_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.affinitysurvey_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.affinitysurvey_id_seq OWNER TO postgres;

--
-- Name: affinitysurvey_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.affinitysurvey_id_seq OWNED BY public.affinitysurvey.id;


--
-- Name: affinitysurveyresults; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.affinitysurveyresults (
    id integer NOT NULL,
    personid integer NOT NULL,
    itemid integer NOT NULL,
    result integer NOT NULL,
    x integer DEFAULT 0,
    y integer DEFAULT 0
);


ALTER TABLE public.affinitysurveyresults OWNER TO postgres;

--
-- Name: affinitysurveyresults_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.affinitysurveyresults_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.affinitysurveyresults_id_seq OWNER TO postgres;

--
-- Name: affinitysurveyresults_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.affinitysurveyresults_id_seq OWNED BY public.affinitysurveyresults.id;


--
-- Name: affinitysurveyversion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.affinitysurveyversion (
    id integer NOT NULL,
    itemid integer NOT NULL,
    version integer NOT NULL,
    versionnote character varying(255)
);


ALTER TABLE public.affinitysurveyversion OWNER TO postgres;

--
-- Name: affinitysurveyversion_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.affinitysurveyversion_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.affinitysurveyversion_id_seq OWNER TO postgres;

--
-- Name: affinitysurveyversion_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.affinitysurveyversion_id_seq OWNED BY public.affinitysurveyversion.id;


--
-- Name: benefit; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.benefit (
    id integer NOT NULL,
    practiceversionid integer,
    name character varying(64),
    description character varying(64),
    content character varying(255),
    lastupdate timestamp without time zone,
    lastupdatebyid integer,
    x integer DEFAULT 0,
    y integer DEFAULT 0
);


ALTER TABLE public.benefit OWNER TO postgres;

--
-- Name: benefit_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.benefit_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.benefit_id_seq OWNER TO postgres;

--
-- Name: benefit_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.benefit_id_seq OWNED BY public.benefit.id;


--
-- Name: bfprofile; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bfprofile (
    id integer NOT NULL,
    personid integer NOT NULL,
    statusid integer NOT NULL,
    o double precision,
    c double precision,
    e double precision,
    a double precision,
    n double precision
);


ALTER TABLE public.bfprofile OWNER TO postgres;

--
-- Name: bfprofile_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.bfprofile_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.bfprofile_id_seq OWNER TO postgres;

--
-- Name: bfprofile_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.bfprofile_id_seq OWNED BY public.bfprofile.id;


--
-- Name: bfprofilestatus; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bfprofilestatus (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text
);


ALTER TABLE public.bfprofilestatus OWNER TO postgres;

--
-- Name: bfprofilestatus_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.bfprofilestatus_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.bfprofilestatus_id_seq OWNER TO postgres;

--
-- Name: bfprofilestatus_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.bfprofilestatus_id_seq OWNED BY public.bfprofilestatus.id;


--
-- Name: completioncriteria; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.completioncriteria (
    id integer NOT NULL,
    practiceversionid integer,
    name character varying(64),
    description character varying(64),
    lastupdate timestamp without time zone,
    lastupdatebyid integer
);


ALTER TABLE public.completioncriteria OWNER TO postgres;

--
-- Name: completioncriteria_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.completioncriteria_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.completioncriteria_id_seq OWNER TO postgres;

--
-- Name: completioncriteria_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.completioncriteria_id_seq OWNED BY public.completioncriteria.id;


--
-- Name: context; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.context (
    id integer NOT NULL,
    description character varying(255)
);


ALTER TABLE public.context OWNER TO postgres;

--
-- Name: context_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.context_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.context_id_seq OWNER TO postgres;

--
-- Name: context_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.context_id_seq OWNED BY public.context.id;


--
-- Name: contextindicator; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contextindicator (
    id integer NOT NULL,
    contextid integer,
    name character varying(64),
    description character varying(255),
    attributes character varying(64),
    "precision" character varying(64),
    value character varying(64)
);


ALTER TABLE public.contextindicator OWNER TO postgres;

--
-- Name: contextindicator_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.contextindicator_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.contextindicator_id_seq OWNER TO postgres;

--
-- Name: contextindicator_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.contextindicator_id_seq OWNED BY public.contextindicator.id;


--
-- Name: goal; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.goal (
    id integer NOT NULL,
    name character varying(64),
    description character varying(255)
);


ALTER TABLE public.goal OWNER TO postgres;

--
-- Name: goal_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.goal_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.goal_id_seq OWNER TO postgres;

--
-- Name: goal_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.goal_id_seq OWNED BY public.goal.id;


--
-- Name: guideline; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.guideline (
    id integer NOT NULL,
    practiceversionid integer,
    methodversionid integer,
    name character varying(64),
    description character varying(64),
    content character varying(255),
    lastupdate timestamp without time zone,
    lastupdatebyid integer,
    typeid integer,
    x integer DEFAULT 0,
    y integer DEFAULT 0
);


ALTER TABLE public.guideline OWNER TO postgres;

--
-- Name: guideline_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.guideline_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.guideline_id_seq OWNER TO postgres;

--
-- Name: guideline_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.guideline_id_seq OWNED BY public.guideline.id;


--
-- Name: guidelinetype; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.guidelinetype (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text
);


ALTER TABLE public.guidelinetype OWNER TO postgres;

--
-- Name: guidelinetype_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.guidelinetype_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.guidelinetype_id_seq OWNER TO postgres;

--
-- Name: guidelinetype_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.guidelinetype_id_seq OWNED BY public.guidelinetype.id;


--
-- Name: method; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.method (
    id integer NOT NULL,
    name character varying(64),
    objective character varying(255),
    description character varying(255),
    typeid integer
);


ALTER TABLE public.method OWNER TO postgres;

--
-- Name: method_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.method_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.method_id_seq OWNER TO postgres;

--
-- Name: method_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.method_id_seq OWNED BY public.method.id;


--
-- Name: methodtype; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.methodtype (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text
);


ALTER TABLE public.methodtype OWNER TO postgres;

--
-- Name: methodtype_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.methodtype_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.methodtype_id_seq OWNER TO postgres;

--
-- Name: methodtype_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.methodtype_id_seq OWNED BY public.methodtype.id;


--
-- Name: methodversion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.methodversion (
    id integer NOT NULL,
    methodid integer NOT NULL,
    universeid integer NOT NULL,
    versionname character varying(255) NOT NULL,
    versiontimestamp timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    changedescription text,
    lastupdate timestamp without time zone,
    lastupdatebyid integer
);


ALTER TABLE public.methodversion OWNER TO postgres;

--
-- Name: methodversion_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.methodversion_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.methodversion_id_seq OWNER TO postgres;

--
-- Name: methodversion_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.methodversion_id_seq OWNED BY public.methodversion.id;


--
-- Name: metric; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.metric (
    id integer NOT NULL,
    name character varying(64),
    unit character varying(64),
    scale character varying(64),
    formula character varying(64),
    lastupdate timestamp without time zone,
    lastupdatebyid integer,
    description character varying(255)
);


ALTER TABLE public.metric OWNER TO postgres;

--
-- Name: metric_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.metric_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.metric_id_seq OWNER TO postgres;

--
-- Name: metric_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.metric_id_seq OWNED BY public.metric.id;


--
-- Name: metricpractice; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.metricpractice (
    metricid integer NOT NULL,
    practiceversionid integer NOT NULL,
    x integer DEFAULT 0,
    y integer DEFAULT 0
);


ALTER TABLE public.metricpractice OWNER TO postgres;

--
-- Name: person; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.person (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    passwordhash character varying(255) NOT NULL,
    roleid integer,
    createdat timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.person OWNER TO postgres;

--
-- Name: person_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.person_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.person_id_seq OWNER TO postgres;

--
-- Name: person_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.person_id_seq OWNED BY public.person.id;


--
-- Name: personpracticeaffinity; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.personpracticeaffinity (
    id integer NOT NULL,
    personid integer NOT NULL,
    practiceversionid integer NOT NULL,
    affinity integer NOT NULL
);


ALTER TABLE public.personpracticeaffinity OWNER TO postgres;

--
-- Name: personpracticeaffinity_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.personpracticeaffinity_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.personpracticeaffinity_id_seq OWNER TO postgres;

--
-- Name: personpracticeaffinity_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.personpracticeaffinity_id_seq OWNED BY public.personpracticeaffinity.id;


--
-- Name: pitfall; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pitfall (
    id integer NOT NULL,
    practiceversionid integer,
    name character varying(64),
    description character varying(255),
    content character varying(255),
    lastupdate timestamp without time zone,
    lastupdatebyid integer,
    x integer DEFAULT 0,
    y integer DEFAULT 0
);


ALTER TABLE public.pitfall OWNER TO postgres;

--
-- Name: pitfall_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pitfall_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pitfall_id_seq OWNER TO postgres;

--
-- Name: pitfall_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pitfall_id_seq OWNED BY public.pitfall.id;


--
-- Name: practice; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.practice (
    id integer NOT NULL,
    name character varying(64) NOT NULL,
    objective character varying(255),
    description character varying(255),
    typeid integer
);


ALTER TABLE public.practice OWNER TO postgres;

--
-- Name: practice_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.practice_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.practice_id_seq OWNER TO postgres;

--
-- Name: practice_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.practice_id_seq OWNED BY public.practice.id;


--
-- Name: practiceassociation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.practiceassociation (
    id integer NOT NULL,
    sourcepracticeversionid integer,
    targetpracticeversionid integer,
    typeid integer
);


ALTER TABLE public.practiceassociation OWNER TO postgres;

--
-- Name: practiceassociation_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.practiceassociation_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.practiceassociation_id_seq OWNER TO postgres;

--
-- Name: practiceassociation_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.practiceassociation_id_seq OWNED BY public.practiceassociation.id;


--
-- Name: practiceassociationtype; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.practiceassociationtype (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text
);


ALTER TABLE public.practiceassociationtype OWNER TO postgres;

--
-- Name: practiceassociationtype_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.practiceassociationtype_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.practiceassociationtype_id_seq OWNER TO postgres;

--
-- Name: practiceassociationtype_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.practiceassociationtype_id_seq OWNED BY public.practiceassociationtype.id;


--
-- Name: practicemethod; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.practicemethod (
    methodversionid integer NOT NULL,
    practiceversionid integer NOT NULL
);


ALTER TABLE public.practicemethod OWNER TO postgres;

--
-- Name: practicetype; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.practicetype (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text
);


ALTER TABLE public.practicetype OWNER TO postgres;

--
-- Name: practicetype_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.practicetype_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.practicetype_id_seq OWNER TO postgres;

--
-- Name: practicetype_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.practicetype_id_seq OWNED BY public.practicetype.id;


--
-- Name: practiceversion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.practiceversion (
    id integer NOT NULL,
    practiceid integer NOT NULL,
    universeid integer NOT NULL,
    versionname character varying(255) NOT NULL,
    versiontimestamp timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    changedescription text,
    lastupdate timestamp without time zone,
    lastupdatebyid integer
);


ALTER TABLE public.practiceversion OWNER TO postgres;

--
-- Name: practiceversion_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.practiceversion_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.practiceversion_id_seq OWNER TO postgres;

--
-- Name: practiceversion_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.practiceversion_id_seq OWNED BY public.practiceversion.id;


--
-- Name: practiceversionactivity; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.practiceversionactivity (
    practiceversionid integer NOT NULL,
    activityid integer NOT NULL,
    sequence integer NOT NULL,
    x integer DEFAULT 0,
    y integer DEFAULT 0
);


ALTER TABLE public.practiceversionactivity OWNER TO postgres;

--
-- Name: practiceversionbenefit; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.practiceversionbenefit (
    practiceversionid integer NOT NULL,
    benefitid integer NOT NULL,
    sequence integer NOT NULL,
    x integer DEFAULT 0,
    y integer DEFAULT 0
);


ALTER TABLE public.practiceversionbenefit OWNER TO postgres;

--
-- Name: practiceversioncompletioncriteria; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.practiceversioncompletioncriteria (
    practiceversionid integer NOT NULL,
    completioncriteriaid integer NOT NULL,
    sequence integer NOT NULL,
    x integer,
    y integer
);


ALTER TABLE public.practiceversioncompletioncriteria OWNER TO postgres;

--
-- Name: practiceversioncontext; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.practiceversioncontext (
    practiceversionid integer NOT NULL,
    contextid integer NOT NULL,
    sequence integer NOT NULL,
    x integer DEFAULT 0,
    y integer DEFAULT 0
);


ALTER TABLE public.practiceversioncontext OWNER TO postgres;

--
-- Name: practiceversiongoal; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.practiceversiongoal (
    practiceversionid integer NOT NULL,
    goalid integer NOT NULL,
    sequence integer DEFAULT 1 NOT NULL,
    x integer DEFAULT 0,
    y integer DEFAULT 0
);


ALTER TABLE public.practiceversiongoal OWNER TO postgres;

--
-- Name: practiceversionguide; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.practiceversionguide (
    practiceversionid integer NOT NULL,
    guidelineid integer NOT NULL,
    sequence integer NOT NULL,
    x integer DEFAULT 0,
    y integer DEFAULT 0
);


ALTER TABLE public.practiceversionguide OWNER TO postgres;

--
-- Name: practiceversionmember; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.practiceversionmember (
    id integer NOT NULL,
    practiceversionid integer NOT NULL,
    personid integer NOT NULL,
    x integer DEFAULT 0 NOT NULL,
    y integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.practiceversionmember OWNER TO postgres;

--
-- Name: practiceversionmember_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.practiceversionmember_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.practiceversionmember_id_seq OWNER TO postgres;

--
-- Name: practiceversionmember_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.practiceversionmember_id_seq OWNED BY public.practiceversionmember.id;


--
-- Name: practiceversionmetric; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.practiceversionmetric (
    practiceversionid integer NOT NULL,
    metricid integer NOT NULL,
    sequence integer NOT NULL,
    x integer DEFAULT 0,
    y integer DEFAULT 0
);


ALTER TABLE public.practiceversionmetric OWNER TO postgres;

--
-- Name: practiceversionpitfall; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.practiceversionpitfall (
    practiceversionid integer NOT NULL,
    pitfallid integer NOT NULL,
    sequence integer NOT NULL,
    x integer DEFAULT 0,
    y integer DEFAULT 0
);


ALTER TABLE public.practiceversionpitfall OWNER TO postgres;

--
-- Name: practiceversionrecommendation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.practiceversionrecommendation (
    practiceversionid integer NOT NULL,
    recommendationid integer NOT NULL,
    sequence integer NOT NULL,
    x integer DEFAULT 0,
    y integer DEFAULT 0
);


ALTER TABLE public.practiceversionrecommendation OWNER TO postgres;

--
-- Name: practiceversionrole; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.practiceversionrole (
    practiceversionid integer NOT NULL,
    roleid integer NOT NULL,
    sequence integer NOT NULL,
    x integer DEFAULT 0,
    y integer DEFAULT 0
);


ALTER TABLE public.practiceversionrole OWNER TO postgres;

--
-- Name: practiceversionuniverse; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.practiceversionuniverse (
    practiceversionid integer NOT NULL,
    universeid integer NOT NULL,
    isactive boolean
);


ALTER TABLE public.practiceversionuniverse OWNER TO postgres;

--
-- Name: practiceversionwork; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.practiceversionwork (
    practiceversionid integer NOT NULL,
    workproductid integer NOT NULL,
    sequence integer NOT NULL,
    x integer DEFAULT 0,
    y integer DEFAULT 0
);


ALTER TABLE public.practiceversionwork OWNER TO postgres;

--
-- Name: recommendation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.recommendation (
    id integer NOT NULL,
    practiceversionid integer,
    contextid integer,
    description character varying(255),
    typeid integer,
    statusid integer,
    lastupdate timestamp without time zone,
    lastupdatebyid integer
);


ALTER TABLE public.recommendation OWNER TO postgres;

--
-- Name: recommendation_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.recommendation_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.recommendation_id_seq OWNER TO postgres;

--
-- Name: recommendation_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.recommendation_id_seq OWNED BY public.recommendation.id;


--
-- Name: recommendationgoal; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.recommendationgoal (
    recommendationid integer NOT NULL,
    goalid integer NOT NULL
);


ALTER TABLE public.recommendationgoal OWNER TO postgres;

--
-- Name: recommendationstatus; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.recommendationstatus (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text
);


ALTER TABLE public.recommendationstatus OWNER TO postgres;

--
-- Name: recommendationstatus_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.recommendationstatus_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.recommendationstatus_id_seq OWNER TO postgres;

--
-- Name: recommendationstatus_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.recommendationstatus_id_seq OWNED BY public.recommendationstatus.id;


--
-- Name: recommendationtype; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.recommendationtype (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text
);


ALTER TABLE public.recommendationtype OWNER TO postgres;

--
-- Name: recommendationtype_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.recommendationtype_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.recommendationtype_id_seq OWNER TO postgres;

--
-- Name: recommendationtype_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.recommendationtype_id_seq OWNED BY public.recommendationtype.id;


--
-- Name: role; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.role (
    id integer NOT NULL,
    name character varying(64),
    description character varying(255),
    lastupdate timestamp without time zone,
    lastupdatebyid integer
);


ALTER TABLE public.role OWNER TO postgres;

--
-- Name: role_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.role_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.role_id_seq OWNER TO postgres;

--
-- Name: role_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.role_id_seq OWNED BY public.role.id;


--
-- Name: roletype; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roletype (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text
);


ALTER TABLE public.roletype OWNER TO postgres;

--
-- Name: roletype_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.roletype_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.roletype_id_seq OWNER TO postgres;

--
-- Name: roletype_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.roletype_id_seq OWNED BY public.roletype.id;


--
-- Name: roleuse; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roleuse (
    practiceversionid integer NOT NULL,
    roleid integer NOT NULL,
    typeid integer,
    x integer DEFAULT 0,
    y integer DEFAULT 0
);


ALTER TABLE public.roleuse OWNER TO postgres;

--
-- Name: roleusetype; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roleusetype (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text
);


ALTER TABLE public.roleusetype OWNER TO postgres;

--
-- Name: roleusetype_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.roleusetype_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.roleusetype_id_seq OWNER TO postgres;

--
-- Name: roleusetype_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.roleusetype_id_seq OWNED BY public.roleusetype.id;


--
-- Name: team; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.team (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text
);


ALTER TABLE public.team OWNER TO postgres;

--
-- Name: team_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.team_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.team_id_seq OWNER TO postgres;

--
-- Name: team_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.team_id_seq OWNED BY public.team.id;


--
-- Name: teammember; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.teammember (
    teamid integer NOT NULL,
    personid integer NOT NULL
);


ALTER TABLE public.teammember OWNER TO postgres;

--
-- Name: universe; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.universe (
    id integer NOT NULL,
    teamid integer NOT NULL,
    name character varying(255) NOT NULL,
    description text
);


ALTER TABLE public.universe OWNER TO postgres;

--
-- Name: universe_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.universe_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.universe_id_seq OWNER TO postgres;

--
-- Name: universe_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.universe_id_seq OWNED BY public.universe.id;


--
-- Name: workproduct; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.workproduct (
    id integer NOT NULL,
    name character varying(64),
    description character varying(255),
    lastupdate timestamp without time zone,
    lastupdatebyid integer
);


ALTER TABLE public.workproduct OWNER TO postgres;

--
-- Name: workproduct_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.workproduct_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.workproduct_id_seq OWNER TO postgres;

--
-- Name: workproduct_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.workproduct_id_seq OWNED BY public.workproduct.id;


--
-- Name: workproductpractice; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.workproductpractice (
    practiceversionid integer NOT NULL,
    workproductid integer NOT NULL,
    x integer DEFAULT 0,
    y integer DEFAULT 0
);


ALTER TABLE public.workproductpractice OWNER TO postgres;

--
-- Name: activity id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activity ALTER COLUMN id SET DEFAULT nextval('public.activity_id_seq'::regclass);


--
-- Name: affinitypractice id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.affinitypractice ALTER COLUMN id SET DEFAULT nextval('public.affinitypractice_id_seq'::regclass);


--
-- Name: affinitysurvey id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.affinitysurvey ALTER COLUMN id SET DEFAULT nextval('public.affinitysurvey_id_seq'::regclass);


--
-- Name: affinitysurveyresults id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.affinitysurveyresults ALTER COLUMN id SET DEFAULT nextval('public.affinitysurveyresults_id_seq'::regclass);


--
-- Name: affinitysurveyversion id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.affinitysurveyversion ALTER COLUMN id SET DEFAULT nextval('public.affinitysurveyversion_id_seq'::regclass);


--
-- Name: benefit id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.benefit ALTER COLUMN id SET DEFAULT nextval('public.benefit_id_seq'::regclass);


--
-- Name: bfprofile id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bfprofile ALTER COLUMN id SET DEFAULT nextval('public.bfprofile_id_seq'::regclass);


--
-- Name: bfprofilestatus id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bfprofilestatus ALTER COLUMN id SET DEFAULT nextval('public.bfprofilestatus_id_seq'::regclass);


--
-- Name: completioncriteria id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.completioncriteria ALTER COLUMN id SET DEFAULT nextval('public.completioncriteria_id_seq'::regclass);


--
-- Name: context id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.context ALTER COLUMN id SET DEFAULT nextval('public.context_id_seq'::regclass);


--
-- Name: contextindicator id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contextindicator ALTER COLUMN id SET DEFAULT nextval('public.contextindicator_id_seq'::regclass);


--
-- Name: goal id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.goal ALTER COLUMN id SET DEFAULT nextval('public.goal_id_seq'::regclass);


--
-- Name: guideline id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.guideline ALTER COLUMN id SET DEFAULT nextval('public.guideline_id_seq'::regclass);


--
-- Name: guidelinetype id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.guidelinetype ALTER COLUMN id SET DEFAULT nextval('public.guidelinetype_id_seq'::regclass);


--
-- Name: method id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.method ALTER COLUMN id SET DEFAULT nextval('public.method_id_seq'::regclass);


--
-- Name: methodtype id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.methodtype ALTER COLUMN id SET DEFAULT nextval('public.methodtype_id_seq'::regclass);


--
-- Name: methodversion id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.methodversion ALTER COLUMN id SET DEFAULT nextval('public.methodversion_id_seq'::regclass);


--
-- Name: metric id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.metric ALTER COLUMN id SET DEFAULT nextval('public.metric_id_seq'::regclass);


--
-- Name: person id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.person ALTER COLUMN id SET DEFAULT nextval('public.person_id_seq'::regclass);


--
-- Name: personpracticeaffinity id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personpracticeaffinity ALTER COLUMN id SET DEFAULT nextval('public.personpracticeaffinity_id_seq'::regclass);


--
-- Name: pitfall id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pitfall ALTER COLUMN id SET DEFAULT nextval('public.pitfall_id_seq'::regclass);


--
-- Name: practice id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.practice ALTER COLUMN id SET DEFAULT nextval('public.practice_id_seq'::regclass);


--
-- Name: practiceassociation id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.practiceassociation ALTER COLUMN id SET DEFAULT nextval('public.practiceassociation_id_seq'::regclass);


--
-- Name: practiceassociationtype id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.practiceassociationtype ALTER COLUMN id SET DEFAULT nextval('public.practiceassociationtype_id_seq'::regclass);


--
-- Name: practicetype id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.practicetype ALTER COLUMN id SET DEFAULT nextval('public.practicetype_id_seq'::regclass);


--
-- Name: practiceversion id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.practiceversion ALTER COLUMN id SET DEFAULT nextval('public.practiceversion_id_seq'::regclass);


--
-- Name: practiceversionmember id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.practiceversionmember ALTER COLUMN id SET DEFAULT nextval('public.practiceversionmember_id_seq'::regclass);


--
-- Name: recommendation id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recommendation ALTER COLUMN id SET DEFAULT nextval('public.recommendation_id_seq'::regclass);


--
-- Name: recommendationstatus id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recommendationstatus ALTER COLUMN id SET DEFAULT nextval('public.recommendationstatus_id_seq'::regclass);


--
-- Name: recommendationtype id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recommendationtype ALTER COLUMN id SET DEFAULT nextval('public.recommendationtype_id_seq'::regclass);


--
-- Name: role id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role ALTER COLUMN id SET DEFAULT nextval('public.role_id_seq'::regclass);


--
-- Name: roletype id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roletype ALTER COLUMN id SET DEFAULT nextval('public.roletype_id_seq'::regclass);


--
-- Name: roleusetype id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roleusetype ALTER COLUMN id SET DEFAULT nextval('public.roleusetype_id_seq'::regclass);


--
-- Name: team id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.team ALTER COLUMN id SET DEFAULT nextval('public.team_id_seq'::regclass);


--
-- Name: universe id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universe ALTER COLUMN id SET DEFAULT nextval('public.universe_id_seq'::regclass);


--
-- Name: workproduct id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workproduct ALTER COLUMN id SET DEFAULT nextval('public.workproduct_id_seq'::regclass);


--
-- Name: activity activity_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activity
    ADD CONSTRAINT activity_pkey PRIMARY KEY (id);


--
-- Name: affinitypractice affinitypractice_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.affinitypractice
    ADD CONSTRAINT affinitypractice_pkey PRIMARY KEY (id);


--
-- Name: affinitysurvey affinitysurvey_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.affinitysurvey
    ADD CONSTRAINT affinitysurvey_pkey PRIMARY KEY (id);


--
-- Name: affinitysurveyresults affinitysurveyresults_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.affinitysurveyresults
    ADD CONSTRAINT affinitysurveyresults_pkey PRIMARY KEY (id);


--
-- Name: affinitysurveyversion affinitysurveyversion_itemid_version_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.affinitysurveyversion
    ADD CONSTRAINT affinitysurveyversion_itemid_version_key UNIQUE (itemid, version);


--
-- Name: affinitysurveyversion affinitysurveyversion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.affinitysurveyversion
    ADD CONSTRAINT affinitysurveyversion_pkey PRIMARY KEY (id);


--
-- Name: benefit benefit_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.benefit
    ADD CONSTRAINT benefit_pkey PRIMARY KEY (id);


--
-- Name: bfprofile bfprofile_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bfprofile
    ADD CONSTRAINT bfprofile_pkey PRIMARY KEY (id);


--
-- Name: bfprofilestatus bfprofilestatus_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bfprofilestatus
    ADD CONSTRAINT bfprofilestatus_name_key UNIQUE (name);


--
-- Name: bfprofilestatus bfprofilestatus_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bfprofilestatus
    ADD CONSTRAINT bfprofilestatus_pkey PRIMARY KEY (id);


--
-- Name: completioncriteria completioncriteria_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.completioncriteria
    ADD CONSTRAINT completioncriteria_pkey PRIMARY KEY (id);


--
-- Name: context context_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.context
    ADD CONSTRAINT context_pkey PRIMARY KEY (id);


--
-- Name: contextindicator contextindicator_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contextindicator
    ADD CONSTRAINT contextindicator_pkey PRIMARY KEY (id);


--
-- Name: goal goal_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.goal
    ADD CONSTRAINT goal_pkey PRIMARY KEY (id);


--
-- Name: guideline guideline_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.guideline
    ADD CONSTRAINT guideline_pkey PRIMARY KEY (id);


--
-- Name: guidelinetype guidelinetype_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.guidelinetype
    ADD CONSTRAINT guidelinetype_name_key UNIQUE (name);


--
-- Name: guidelinetype guidelinetype_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.guidelinetype
    ADD CONSTRAINT guidelinetype_pkey PRIMARY KEY (id);


--
-- Name: method method_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.method
    ADD CONSTRAINT method_pkey PRIMARY KEY (id);


--
-- Name: methodtype methodtype_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.methodtype
    ADD CONSTRAINT methodtype_name_key UNIQUE (name);


--
-- Name: methodtype methodtype_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.methodtype
    ADD CONSTRAINT methodtype_pkey PRIMARY KEY (id);


--
-- Name: methodversion methodversion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.methodversion
    ADD CONSTRAINT methodversion_pkey PRIMARY KEY (id);


--
-- Name: metric metric_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.metric
    ADD CONSTRAINT metric_pkey PRIMARY KEY (id);


--
-- Name: metricpractice metricpractice_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.metricpractice
    ADD CONSTRAINT metricpractice_pkey PRIMARY KEY (metricid, practiceversionid);


--
-- Name: person person_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.person
    ADD CONSTRAINT person_email_key UNIQUE (email);


--
-- Name: person person_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.person
    ADD CONSTRAINT person_pkey PRIMARY KEY (id);


--
-- Name: personpracticeaffinity personpracticeaffinity_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personpracticeaffinity
    ADD CONSTRAINT personpracticeaffinity_pkey PRIMARY KEY (id);


--
-- Name: pitfall pitfall_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pitfall
    ADD CONSTRAINT pitfall_pkey PRIMARY KEY (id);


--
-- Name: practice practice_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.practice
    ADD CONSTRAINT practice_name_key UNIQUE (name);


--
-- Name: practice practice_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.practice
    ADD CONSTRAINT practice_pkey PRIMARY KEY (id);


--
-- Name: practiceassociation practiceassociation_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.practiceassociation
    ADD CONSTRAINT practiceassociation_pkey PRIMARY KEY (id);


--
-- Name: practiceassociationtype practiceassociationtype_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.practiceassociationtype
    ADD CONSTRAINT practiceassociationtype_name_key UNIQUE (name);


--
-- Name: practiceassociationtype practiceassociationtype_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.practiceassociationtype
    ADD CONSTRAINT practiceassociationtype_pkey PRIMARY KEY (id);


--
-- Name: practicemethod practicemethod_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.practicemethod
    ADD CONSTRAINT practicemethod_pkey PRIMARY KEY (methodversionid, practiceversionid);


--
-- Name: practicetype practicetype_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.practicetype
    ADD CONSTRAINT practicetype_name_key UNIQUE (name);


--
-- Name: practicetype practicetype_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.practicetype
    ADD CONSTRAINT practicetype_pkey PRIMARY KEY (id);


--
-- Name: practiceversion practiceversion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.practiceversion
    ADD CONSTRAINT practiceversion_pkey PRIMARY KEY (id);


--
-- Name: practiceversionactivity practiceversionactivity_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.practiceversionactivity
    ADD CONSTRAINT practiceversionactivity_pkey PRIMARY KEY (practiceversionid, activityid);


--
-- Name: practiceversionactivity practiceversionactivity_practiceversionid_sequence_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.practiceversionactivity
    ADD CONSTRAINT practiceversionactivity_practiceversionid_sequence_key UNIQUE (practiceversionid, sequence);


--
-- Name: practiceversioncompletioncriteria practiceversioncompletioncriteria_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.practiceversioncompletioncriteria
    ADD CONSTRAINT practiceversioncompletioncriteria_pkey PRIMARY KEY (practiceversionid, completioncriteriaid);


--
-- Name: practiceversioncontext practiceversioncontext_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.practiceversioncontext
    ADD CONSTRAINT practiceversioncontext_pkey PRIMARY KEY (practiceversionid, contextid);


--
-- Name: practiceversiongoal practiceversiongoal_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.practiceversiongoal
    ADD CONSTRAINT practiceversiongoal_pkey PRIMARY KEY (practiceversionid, goalid);


--
-- Name: practiceversionmember practiceversionmember_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.practiceversionmember
    ADD CONSTRAINT practiceversionmember_pkey PRIMARY KEY (id);


--
-- Name: practiceversionmember practiceversionmember_practiceversionid_personid_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.practiceversionmember
    ADD CONSTRAINT practiceversionmember_practiceversionid_personid_key UNIQUE (practiceversionid, personid);


--
-- Name: practiceversionrecommendation practiceversionrecommendation_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.practiceversionrecommendation
    ADD CONSTRAINT practiceversionrecommendation_pkey PRIMARY KEY (practiceversionid, recommendationid);


--
-- Name: practiceversionuniverse practiceversionuniverse_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.practiceversionuniverse
    ADD CONSTRAINT practiceversionuniverse_pkey PRIMARY KEY (practiceversionid, universeid);


--
-- Name: recommendation recommendation_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recommendation
    ADD CONSTRAINT recommendation_pkey PRIMARY KEY (id);


--
-- Name: recommendationgoal recommendationgoal_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recommendationgoal
    ADD CONSTRAINT recommendationgoal_pkey PRIMARY KEY (recommendationid, goalid);


--
-- Name: recommendationstatus recommendationstatus_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recommendationstatus
    ADD CONSTRAINT recommendationstatus_name_key UNIQUE (name);


--
-- Name: recommendationstatus recommendationstatus_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recommendationstatus
    ADD CONSTRAINT recommendationstatus_pkey PRIMARY KEY (id);


--
-- Name: recommendationtype recommendationtype_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recommendationtype
    ADD CONSTRAINT recommendationtype_name_key UNIQUE (name);


--
-- Name: recommendationtype recommendationtype_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recommendationtype
    ADD CONSTRAINT recommendationtype_pkey PRIMARY KEY (id);


--
-- Name: role role_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_pkey PRIMARY KEY (id);


--
-- Name: roletype roletype_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roletype
    ADD CONSTRAINT roletype_name_key UNIQUE (name);


--
-- Name: roletype roletype_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roletype
    ADD CONSTRAINT roletype_pkey PRIMARY KEY (id);


--
-- Name: roleuse roleuse_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roleuse
    ADD CONSTRAINT roleuse_pkey PRIMARY KEY (practiceversionid, roleid);


--
-- Name: roleusetype roleusetype_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roleusetype
    ADD CONSTRAINT roleusetype_name_key UNIQUE (name);


--
-- Name: roleusetype roleusetype_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roleusetype
    ADD CONSTRAINT roleusetype_pkey PRIMARY KEY (id);


--
-- Name: team team_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.team
    ADD CONSTRAINT team_pkey PRIMARY KEY (id);


--
-- Name: teammember teammember_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teammember
    ADD CONSTRAINT teammember_pkey PRIMARY KEY (teamid, personid);


--
-- Name: affinitysurveyresults unique_person_item; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.affinitysurveyresults
    ADD CONSTRAINT unique_person_item UNIQUE (personid, itemid);


--
-- Name: universe universe_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universe
    ADD CONSTRAINT universe_pkey PRIMARY KEY (id);


--
-- Name: workproduct workproduct_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workproduct
    ADD CONSTRAINT workproduct_pkey PRIMARY KEY (id);


--
-- Name: workproductpractice workproductpractice_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workproductpractice
    ADD CONSTRAINT workproductpractice_pkey PRIMARY KEY (practiceversionid, workproductid);


--
-- Name: idx_personpracticeaffinity_person; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_personpracticeaffinity_person ON public.personpracticeaffinity USING btree (personid);


--
-- Name: idx_personpracticeaffinity_practice; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_personpracticeaffinity_practice ON public.personpracticeaffinity USING btree (practiceversionid);


--
-- Name: idx_practiceversion_practice; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_practiceversion_practice ON public.practiceversion USING btree (practiceid);


--
-- Name: idx_practiceversion_universe; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_practiceversion_universe ON public.practiceversion USING btree (universeid);


--
-- Name: idx_recommendation_context; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_recommendation_context ON public.recommendation USING btree (contextid);


--
-- Name: idx_recommendation_practice; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_recommendation_practice ON public.recommendation USING btree (practiceversionid);


--
-- Name: affinitypractice affinitypractice_itemid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.affinitypractice
    ADD CONSTRAINT affinitypractice_itemid_fkey FOREIGN KEY (itemid) REFERENCES public.affinitysurveyversion(id);


--
-- Name: affinitypractice affinitypractice_practiceversionid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.affinitypractice
    ADD CONSTRAINT affinitypractice_practiceversionid_fkey FOREIGN KEY (practiceversionid) REFERENCES public.practiceversion(id);


--
-- Name: affinitysurveyresults affinitysurveyresults_itemid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.affinitysurveyresults
    ADD CONSTRAINT affinitysurveyresults_itemid_fkey FOREIGN KEY (itemid) REFERENCES public.affinitysurveyversion(id);


--
-- Name: affinitysurveyresults affinitysurveyresults_personid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.affinitysurveyresults
    ADD CONSTRAINT affinitysurveyresults_personid_fkey FOREIGN KEY (personid) REFERENCES public.person(id);


--
-- Name: affinitysurveyversion affinitysurveyversion_itemid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.affinitysurveyversion
    ADD CONSTRAINT affinitysurveyversion_itemid_fkey FOREIGN KEY (itemid) REFERENCES public.affinitysurvey(id);


--
-- Name: benefit benefit_lastupdatebyid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.benefit
    ADD CONSTRAINT benefit_lastupdatebyid_fkey FOREIGN KEY (lastupdatebyid) REFERENCES public.person(id);


--
-- Name: benefit benefit_practiceversionid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.benefit
    ADD CONSTRAINT benefit_practiceversionid_fkey FOREIGN KEY (practiceversionid) REFERENCES public.practiceversion(id);


--
-- Name: bfprofile bfprofile_personid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bfprofile
    ADD CONSTRAINT bfprofile_personid_fkey FOREIGN KEY (personid) REFERENCES public.person(id);


--
-- Name: bfprofile bfprofile_statusid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bfprofile
    ADD CONSTRAINT bfprofile_statusid_fkey FOREIGN KEY (statusid) REFERENCES public.bfprofilestatus(id);


--
-- Name: completioncriteria completioncriteria_lastupdatebyid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.completioncriteria
    ADD CONSTRAINT completioncriteria_lastupdatebyid_fkey FOREIGN KEY (lastupdatebyid) REFERENCES public.person(id);


--
-- Name: completioncriteria completioncriteria_practiceversionid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.completioncriteria
    ADD CONSTRAINT completioncriteria_practiceversionid_fkey FOREIGN KEY (practiceversionid) REFERENCES public.practiceversion(id);


--
-- Name: contextindicator contextindicator_contextid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contextindicator
    ADD CONSTRAINT contextindicator_contextid_fkey FOREIGN KEY (contextid) REFERENCES public.context(id);


--
-- Name: activity fk_activity_person; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activity
    ADD CONSTRAINT fk_activity_person FOREIGN KEY (lastupdatebyid) REFERENCES public.person(id);


--
-- Name: metric fk_metric_person; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.metric
    ADD CONSTRAINT fk_metric_person FOREIGN KEY (lastupdatebyid) REFERENCES public.person(id);


--
-- Name: role fk_role_person; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT fk_role_person FOREIGN KEY (lastupdatebyid) REFERENCES public.person(id);


--
-- Name: workproduct fk_workproduct_person; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workproduct
    ADD CONSTRAINT fk_workproduct_person FOREIGN KEY (lastupdatebyid) REFERENCES public.person(id);


--
-- Name: guideline guideline_lastupdatebyid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.guideline
    ADD CONSTRAINT guideline_lastupdatebyid_fkey FOREIGN KEY (lastupdatebyid) REFERENCES public.person(id);


--
-- Name: guideline guideline_methodversionid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.guideline
    ADD CONSTRAINT guideline_methodversionid_fkey FOREIGN KEY (methodversionid) REFERENCES public.methodversion(id);


--
-- Name: guideline guideline_practiceversionid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.guideline
    ADD CONSTRAINT guideline_practiceversionid_fkey FOREIGN KEY (practiceversionid) REFERENCES public.practiceversion(id);


--
-- Name: guideline guideline_typeid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.guideline
    ADD CONSTRAINT guideline_typeid_fkey FOREIGN KEY (typeid) REFERENCES public.guidelinetype(id);


--
-- Name: method method_typeid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.method
    ADD CONSTRAINT method_typeid_fkey FOREIGN KEY (typeid) REFERENCES public.methodtype(id);


--
-- Name: methodversion methodversion_lastupdatebyid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.methodversion
    ADD CONSTRAINT methodversion_lastupdatebyid_fkey FOREIGN KEY (lastupdatebyid) REFERENCES public.person(id);


--
-- Name: methodversion methodversion_methodid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.methodversion
    ADD CONSTRAINT methodversion_methodid_fkey FOREIGN KEY (methodid) REFERENCES public.method(id);


--
-- Name: methodversion methodversion_universeid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.methodversion
    ADD CONSTRAINT methodversion_universeid_fkey FOREIGN KEY (universeid) REFERENCES public.universe(id);


--
-- Name: metricpractice metricpractice_metricid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.metricpractice
    ADD CONSTRAINT metricpractice_metricid_fkey FOREIGN KEY (metricid) REFERENCES public.metric(id);


--
-- Name: metricpractice metricpractice_practiceversionid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.metricpractice
    ADD CONSTRAINT metricpractice_practiceversionid_fkey FOREIGN KEY (practiceversionid) REFERENCES public.practiceversion(id);


--
-- Name: person person_roleid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.person
    ADD CONSTRAINT person_roleid_fkey FOREIGN KEY (roleid) REFERENCES public.roletype(id);


--
-- Name: personpracticeaffinity personpracticeaffinity_personid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personpracticeaffinity
    ADD CONSTRAINT personpracticeaffinity_personid_fkey FOREIGN KEY (personid) REFERENCES public.person(id);


--
-- Name: personpracticeaffinity personpracticeaffinity_practiceversionid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personpracticeaffinity
    ADD CONSTRAINT personpracticeaffinity_practiceversionid_fkey FOREIGN KEY (practiceversionid) REFERENCES public.practiceversion(id);


--
-- Name: pitfall pitfall_lastupdatebyid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pitfall
    ADD CONSTRAINT pitfall_lastupdatebyid_fkey FOREIGN KEY (lastupdatebyid) REFERENCES public.person(id);


--
-- Name: pitfall pitfall_practiceversionid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pitfall
    ADD CONSTRAINT pitfall_practiceversionid_fkey FOREIGN KEY (practiceversionid) REFERENCES public.practiceversion(id);


--
-- Name: practice practice_typeid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.practice
    ADD CONSTRAINT practice_typeid_fkey FOREIGN KEY (typeid) REFERENCES public.practicetype(id);


--
-- Name: practiceassociation practiceassociation_sourcepracticeversionid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.practiceassociation
    ADD CONSTRAINT practiceassociation_sourcepracticeversionid_fkey FOREIGN KEY (sourcepracticeversionid) REFERENCES public.practiceversion(id);


--
-- Name: practiceassociation practiceassociation_targetpracticeversionid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.practiceassociation
    ADD CONSTRAINT practiceassociation_targetpracticeversionid_fkey FOREIGN KEY (targetpracticeversionid) REFERENCES public.practiceversion(id);


--
-- Name: practiceassociation practiceassociation_typeid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.practiceassociation
    ADD CONSTRAINT practiceassociation_typeid_fkey FOREIGN KEY (typeid) REFERENCES public.practiceassociationtype(id);


--
-- Name: practicemethod practicemethod_methodversionid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.practicemethod
    ADD CONSTRAINT practicemethod_methodversionid_fkey FOREIGN KEY (methodversionid) REFERENCES public.methodversion(id);


--
-- Name: practicemethod practicemethod_practiceversionid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.practicemethod
    ADD CONSTRAINT practicemethod_practiceversionid_fkey FOREIGN KEY (practiceversionid) REFERENCES public.practiceversion(id);


--
-- Name: practiceversion practiceversion_lastupdatebyid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.practiceversion
    ADD CONSTRAINT practiceversion_lastupdatebyid_fkey FOREIGN KEY (lastupdatebyid) REFERENCES public.person(id);


--
-- Name: practiceversion practiceversion_practiceid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.practiceversion
    ADD CONSTRAINT practiceversion_practiceid_fkey FOREIGN KEY (practiceid) REFERENCES public.practice(id);


--
-- Name: practiceversion practiceversion_universeid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.practiceversion
    ADD CONSTRAINT practiceversion_universeid_fkey FOREIGN KEY (universeid) REFERENCES public.universe(id);


--
-- Name: practiceversionactivity practiceversionactivity_activityid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.practiceversionactivity
    ADD CONSTRAINT practiceversionactivity_activityid_fkey FOREIGN KEY (activityid) REFERENCES public.activity(id);


--
-- Name: practiceversionactivity practiceversionactivity_practiceversionid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.practiceversionactivity
    ADD CONSTRAINT practiceversionactivity_practiceversionid_fkey FOREIGN KEY (practiceversionid) REFERENCES public.practiceversion(id);


--
-- Name: practiceversioncompletioncriteria practiceversioncompletioncriteria_completioncriteriaid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.practiceversioncompletioncriteria
    ADD CONSTRAINT practiceversioncompletioncriteria_completioncriteriaid_fkey FOREIGN KEY (completioncriteriaid) REFERENCES public.completioncriteria(id);


--
-- Name: practiceversioncompletioncriteria practiceversioncompletioncriteria_practiceversionid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.practiceversioncompletioncriteria
    ADD CONSTRAINT practiceversioncompletioncriteria_practiceversionid_fkey FOREIGN KEY (practiceversionid) REFERENCES public.practiceversion(id);


--
-- Name: practiceversioncontext practiceversioncontext_contextid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.practiceversioncontext
    ADD CONSTRAINT practiceversioncontext_contextid_fkey FOREIGN KEY (contextid) REFERENCES public.context(id);


--
-- Name: practiceversioncontext practiceversioncontext_practiceversionid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.practiceversioncontext
    ADD CONSTRAINT practiceversioncontext_practiceversionid_fkey FOREIGN KEY (practiceversionid) REFERENCES public.practiceversion(id);


--
-- Name: practiceversiongoal practiceversiongoal_goalid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.practiceversiongoal
    ADD CONSTRAINT practiceversiongoal_goalid_fkey FOREIGN KEY (goalid) REFERENCES public.goal(id) ON DELETE CASCADE;


--
-- Name: practiceversiongoal practiceversiongoal_practiceversionid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.practiceversiongoal
    ADD CONSTRAINT practiceversiongoal_practiceversionid_fkey FOREIGN KEY (practiceversionid) REFERENCES public.practiceversion(id) ON DELETE CASCADE;


--
-- Name: practiceversionmember practiceversionmember_personid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.practiceversionmember
    ADD CONSTRAINT practiceversionmember_personid_fkey FOREIGN KEY (personid) REFERENCES public.person(id) ON DELETE CASCADE;


--
-- Name: practiceversionmember practiceversionmember_practiceversionid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.practiceversionmember
    ADD CONSTRAINT practiceversionmember_practiceversionid_fkey FOREIGN KEY (practiceversionid) REFERENCES public.practiceversion(id) ON DELETE CASCADE;


--
-- Name: practiceversionuniverse practiceversionuniverse_practiceversionid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.practiceversionuniverse
    ADD CONSTRAINT practiceversionuniverse_practiceversionid_fkey FOREIGN KEY (practiceversionid) REFERENCES public.practiceversion(id);


--
-- Name: practiceversionuniverse practiceversionuniverse_universeid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.practiceversionuniverse
    ADD CONSTRAINT practiceversionuniverse_universeid_fkey FOREIGN KEY (universeid) REFERENCES public.universe(id);


--
-- Name: recommendation recommendation_contextid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recommendation
    ADD CONSTRAINT recommendation_contextid_fkey FOREIGN KEY (contextid) REFERENCES public.context(id);


--
-- Name: recommendation recommendation_lastupdatebyid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recommendation
    ADD CONSTRAINT recommendation_lastupdatebyid_fkey FOREIGN KEY (lastupdatebyid) REFERENCES public.person(id);


--
-- Name: recommendation recommendation_practiceversionid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recommendation
    ADD CONSTRAINT recommendation_practiceversionid_fkey FOREIGN KEY (practiceversionid) REFERENCES public.practiceversion(id);


--
-- Name: recommendation recommendation_statusid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recommendation
    ADD CONSTRAINT recommendation_statusid_fkey FOREIGN KEY (statusid) REFERENCES public.recommendationstatus(id);


--
-- Name: recommendation recommendation_typeid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recommendation
    ADD CONSTRAINT recommendation_typeid_fkey FOREIGN KEY (typeid) REFERENCES public.recommendationtype(id);


--
-- Name: recommendationgoal recommendationgoal_goalid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recommendationgoal
    ADD CONSTRAINT recommendationgoal_goalid_fkey FOREIGN KEY (goalid) REFERENCES public.goal(id);


--
-- Name: recommendationgoal recommendationgoal_recommendationid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recommendationgoal
    ADD CONSTRAINT recommendationgoal_recommendationid_fkey FOREIGN KEY (recommendationid) REFERENCES public.recommendation(id);


--
-- Name: roleuse roleuse_practiceversionid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roleuse
    ADD CONSTRAINT roleuse_practiceversionid_fkey FOREIGN KEY (practiceversionid) REFERENCES public.practiceversion(id);


--
-- Name: roleuse roleuse_roleid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roleuse
    ADD CONSTRAINT roleuse_roleid_fkey FOREIGN KEY (roleid) REFERENCES public.role(id);


--
-- Name: roleuse roleuse_typeid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roleuse
    ADD CONSTRAINT roleuse_typeid_fkey FOREIGN KEY (typeid) REFERENCES public.roleusetype(id);


--
-- Name: teammember teammember_personid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teammember
    ADD CONSTRAINT teammember_personid_fkey FOREIGN KEY (personid) REFERENCES public.person(id) ON DELETE CASCADE;


--
-- Name: teammember teammember_teamid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teammember
    ADD CONSTRAINT teammember_teamid_fkey FOREIGN KEY (teamid) REFERENCES public.team(id) ON DELETE CASCADE;


--
-- Name: universe universe_teamid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universe
    ADD CONSTRAINT universe_teamid_fkey FOREIGN KEY (teamid) REFERENCES public.team(id);


--
-- Name: workproductpractice workproductpractice_practiceversionid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workproductpractice
    ADD CONSTRAINT workproductpractice_practiceversionid_fkey FOREIGN KEY (practiceversionid) REFERENCES public.practiceversion(id);


--
-- Name: workproductpractice workproductpractice_workproductid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workproductpractice
    ADD CONSTRAINT workproductpractice_workproductid_fkey FOREIGN KEY (workproductid) REFERENCES public.workproduct(id);


--
-- PostgreSQL database dump complete
--

\unrestrict m58wYEniKyq02bCCL5IL98HOA2lBSY3HCpd8qzM5OF0V94APzHUYMZ2Pz9llUwz

